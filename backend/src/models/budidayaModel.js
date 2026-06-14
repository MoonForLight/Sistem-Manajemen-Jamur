const { db } = require('../config/db');

const baseSelect = `SELECT
  b.id_budidaya,
  b.tanggal_mulai,
  b.tanggal_selesai,
  b.status,
  b.jumlah_rak,
  b.target_lingkungan_harian,
  b.target_pertumbuhan_harian,
  b.alasan_selesai,
  l.id_lokasi,
  l.nama_lokasi,
  j.id_jenis,
  j.nama_jamur,
  m.id_media,
  m.nama_media,
  u.id_user AS id_petugas,
  u.nama AS nama_petugas
FROM budidaya b
JOIN lokasi l ON b.id_lokasi = l.id_lokasi
JOIN jenis_jamur j ON b.id_jenis = j.id_jenis
JOIN media_tanam m ON b.id_media = m.id_media
LEFT JOIN users u ON b.id_petugas = u.id_user`;

async function getAll() {
  const [rows] = await db.query(`${baseSelect} ORDER BY b.id_budidaya DESC`);
  return rows;
}

async function getById(id) {
  const [rows] = await db.query(`${baseSelect} WHERE b.id_budidaya = ?`, [id]);
  return rows[0] || null;
}

async function create({ id_lokasi, id_jenis, id_media, id_petugas, tanggal_mulai, status, jumlah_rak, target_lingkungan_harian = 2, target_pertumbuhan_harian = 2 }) {
  const [result] = await db.query(
    `INSERT INTO budidaya
      (id_lokasi, id_jenis, id_media, id_petugas, tanggal_mulai, status, jumlah_rak, target_lingkungan_harian, target_pertumbuhan_harian)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_lokasi, id_jenis, id_media, id_petugas, tanggal_mulai, status, jumlah_rak, target_lingkungan_harian, target_pertumbuhan_harian]
  );
  return result.insertId;
}

async function update(id, data) {
  const [result] = await db.query(
    `UPDATE budidaya
     SET id_lokasi = ?, id_jenis = ?, id_media = ?, id_petugas = ?, tanggal_mulai = ?,
         status = ?, jumlah_rak = ?, target_lingkungan_harian = ?, target_pertumbuhan_harian = ?, alasan_selesai = ?,
         tanggal_selesai = CASE
           WHEN ? = 'selesai' THEN COALESCE(tanggal_selesai, CURDATE())
           ELSE NULL
         END
     WHERE id_budidaya = ?`,
    [
      data.id_lokasi,
      data.id_jenis,
      data.id_media,
      data.id_petugas,
      data.tanggal_mulai,
      data.status,
      data.jumlah_rak,
      data.target_lingkungan_harian,
      data.target_pertumbuhan_harian,
      data.alasan_selesai || null,
      data.status,
      id,
    ]
  );
  return result.affectedRows;
}

async function updateDailyTargets(id, target_lingkungan_harian, target_pertumbuhan_harian) {
  const [result] = await db.query(
    `UPDATE budidaya
     SET target_lingkungan_harian = ?, target_pertumbuhan_harian = ?
     WHERE id_budidaya = ?`,
    [target_lingkungan_harian, target_pertumbuhan_harian, id]
  );
  return result.affectedRows;
}

async function selesaikan(id, alasan_selesai) {
  const [result] = await db.query(
    `UPDATE budidaya
     SET status = 'selesai', alasan_selesai = ?, tanggal_selesai = CURDATE()
     WHERE id_budidaya = ? AND status <> 'selesai'`,
    [alasan_selesai, id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await db.query('DELETE FROM budidaya WHERE id_budidaya = ?', [id]);
  return result.affectedRows;
}

async function exists(id_budidaya) {
  const [rows] = await db.query('SELECT id_budidaya FROM budidaya WHERE id_budidaya = ? LIMIT 1', [id_budidaya]);
  return rows.length > 0;
}

async function getByLokasi(id_lokasi) {
  const [rows] = await db.query(
    `SELECT
      b.id_budidaya,
      b.tanggal_mulai,
      b.tanggal_selesai,
      b.status,
      b.jumlah_rak,
      b.alasan_selesai,
      j.nama_jamur AS jenis
     FROM budidaya b
     JOIN jenis_jamur j ON b.id_jenis = j.id_jenis
     WHERE b.id_lokasi = ?
     ORDER BY b.tanggal_mulai DESC`,
    [id_lokasi]
  );
  return rows;
}

async function getByPetugas(id_petugas, filters = {}) {
  const conditions = ['b.id_petugas = ?'];
  const params = [id_petugas];

  if (filters.id_jenis) {
    conditions.push('b.id_jenis = ?');
    params.push(filters.id_jenis);
  }
  if (filters.id_lokasi) {
    conditions.push('b.id_lokasi = ?');
    params.push(filters.id_lokasi);
  }
  if (Array.isArray(filters.statuses) && filters.statuses.length) {
    conditions.push(`b.status IN (${filters.statuses.map(() => '?').join(', ')})`);
    params.push(...filters.statuses);
  }
  if (filters.q) {
    conditions.push('(j.nama_jamur LIKE ? OR l.nama_lokasi LIKE ? OR CAST(b.id_budidaya AS CHAR) LIKE ?)');
    const q = `%${filters.q}%`;
    params.push(q, q, q);
  }

  const [rows] = await db.query(
    `${baseSelect}
     WHERE ${conditions.join(' AND ')}
     ORDER BY j.nama_jamur ASC, b.id_budidaya DESC`,
    params
  );
  return rows;
}

async function getSummary() {
  const [rows] = await db.query(
    `SELECT
      b.id_budidaya,
      b.tanggal_mulai,
      b.tanggal_selesai,
      b.status,
      b.jumlah_rak,
      b.alasan_selesai,
      l.nama_lokasi,
      j.nama_jamur,
      m.nama_media,
      u.nama AS nama_petugas,
      (SELECT COUNT(*) FROM pertumbuhan p WHERE p.id_budidaya = b.id_budidaya) AS total_pengamatan,
      (SELECT COALESCE(SUM(pa.jumlah_panen), 0) FROM panen pa WHERE pa.id_budidaya = b.id_budidaya) AS total_panen
     FROM budidaya b
     JOIN lokasi l ON b.id_lokasi = l.id_lokasi
     JOIN jenis_jamur j ON b.id_jenis = j.id_jenis
     JOIN media_tanam m ON b.id_media = m.id_media
     LEFT JOIN users u ON b.id_petugas = u.id_user
     ORDER BY b.id_budidaya DESC`
  );
  return rows;
}

async function getActiveRacksByLokasi(id_lokasi, exclude_budidaya_id = null) {
  let query = "SELECT COALESCE(SUM(jumlah_rak), 0) AS used_racks FROM budidaya WHERE id_lokasi = ? AND status IN ('aktif', 'inisiasi')";
  const params = [id_lokasi];
  if (exclude_budidaya_id) {
    query += ' AND id_budidaya <> ?';
    params.push(exclude_budidaya_id);
  }
  const [rows] = await db.query(query, params);
  return Number(rows[0].used_racks || 0);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  updateDailyTargets,
  selesaikan,
  remove,
  exists,
  getByLokasi,
  getByPetugas,
  getSummary,
  getActiveRacksByLokasi,
};
