const { db } = require('../config/db');

const baseSelect = `SELECT
  l.id_lingkungan,
  l.id_budidaya,
  l.id_petugas,
  u.nama AS nama_petugas,
  l.tanggal_pengukuran,
  l.waktu_pengukuran,
  l.suhu,
  l.kelembaban,
  l.intensitas_cahaya,
  l.foto
FROM lingkungan_harian l
JOIN users u ON l.id_petugas = u.id_user`;

async function getAll() {
  const [rows] = await db.query(`${baseSelect}
    ORDER BY l.tanggal_pengukuran DESC, l.id_lingkungan DESC`);
  return rows;
}

async function getById(id) {
  const [rows] = await db.query(`${baseSelect} WHERE l.id_lingkungan = ?`, [id]);
  return rows[0] || null;
}

async function getByBudidaya(id_budidaya) {
  const [rows] = await db.query(`${baseSelect}
    WHERE l.id_budidaya = ?
    ORDER BY l.tanggal_pengukuran DESC, l.id_lingkungan DESC`, [id_budidaya]);
  return rows;
}

async function create(data) {
  const [result] = await db.query(
    `INSERT INTO lingkungan_harian
      (id_budidaya, id_petugas, tanggal_pengukuran, waktu_pengukuran, suhu, kelembaban, intensitas_cahaya, foto)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.id_budidaya,
      data.id_petugas,
      data.tanggal_pengukuran,
      data.waktu_pengukuran || 'Pagi',
      data.suhu ?? null,
      data.kelembaban ?? null,
      data.intensitas_cahaya ?? null,
      data.foto ?? null,
    ]
  );
  return result.insertId;
}

async function update(id, data) {
  const [result] = await db.query(
    `UPDATE lingkungan_harian
     SET id_budidaya = ?, id_petugas = ?, tanggal_pengukuran = ?, waktu_pengukuran = ?,
         suhu = ?, kelembaban = ?, intensitas_cahaya = ?, foto = ?
     WHERE id_lingkungan = ?`,
    [
      data.id_budidaya,
      data.id_petugas,
      data.tanggal_pengukuran,
      data.waktu_pengukuran || 'Pagi',
      data.suhu ?? null,
      data.kelembaban ?? null,
      data.intensitas_cahaya ?? null,
      data.foto ?? null,
      id,
    ]
  );
  return result.affectedRows;
}

async function getByLokasi(id_lokasi) {
  const [rows] = await db.query(`${baseSelect}
    JOIN budidaya b ON l.id_budidaya = b.id_budidaya
    WHERE b.id_lokasi = ?
    ORDER BY l.tanggal_pengukuran ASC`, [id_lokasi]);
  return rows;
}

async function remove(id) {
  const [result] = await db.query('DELETE FROM lingkungan_harian WHERE id_lingkungan = ?', [id]);
  return result.affectedRows;
}

async function countByPetugasAndTanggal(id_petugas, tanggal_pengukuran, id_budidaya = null, excludeId = null) {
  const conditions = ['id_petugas = ?', 'tanggal_pengukuran = ?'];
  const params = [id_petugas, tanggal_pengukuran];
  if (id_budidaya) {
    conditions.push('id_budidaya = ?');
    params.push(id_budidaya);
  }
  if (excludeId) {
    conditions.push('id_lingkungan <> ?');
    params.push(excludeId);
  }
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total FROM lingkungan_harian WHERE ${conditions.join(' AND ')}`,
    params
  );
  return Number(rows?.[0]?.total || 0);
}

async function getWaktuByPetugasAndTanggal(id_petugas, tanggal_pengukuran, id_budidaya = null, excludeId = null) {
  const conditions = ['id_petugas = ?', 'tanggal_pengukuran = ?'];
  const params = [id_petugas, tanggal_pengukuran];
  if (id_budidaya) {
    conditions.push('id_budidaya = ?');
    params.push(id_budidaya);
  }
  if (excludeId) {
    conditions.push('id_lingkungan <> ?');
    params.push(excludeId);
  }
  const [rows] = await db.query(
    `SELECT waktu_pengukuran FROM lingkungan_harian WHERE ${conditions.join(' AND ')}`,
    params
  );
  return rows;
}

module.exports = {
  getAll,
  getById,
  getByBudidaya,
  getByLokasi,
  create,
  update,
  remove,
  countByPetugasAndTanggal,
  getWaktuByPetugasAndTanggal,
};
