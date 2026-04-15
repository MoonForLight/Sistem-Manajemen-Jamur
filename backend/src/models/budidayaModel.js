const { db } = require("../config/db");

async function getAll() {
  const [rows] = await db.query(
    `SELECT 
        b.id_budidaya,
        b.tanggal_mulai,
        b.status,
        l.id_lokasi, l.nama_lokasi,
        j.id_jenis, j.nama_jamur,
        m.id_media, m.nama_media,
        u.id_user AS id_petugas, u.nama AS nama_petugas
     FROM budidaya b
     JOIN lokasi l ON b.id_lokasi = l.id_lokasi
     JOIN jenis_jamur j ON b.id_jenis = j.id_jenis
     JOIN media_tanam m ON b.id_media = m.id_media
     JOIN users u ON b.id_petugas = u.id_user
     ORDER BY b.id_budidaya DESC`
  );
  return rows;
}

async function getById(id) {
  const [rows] = await db.query(
    `SELECT 
        b.id_budidaya,
        b.tanggal_mulai,
        b.status,
        l.id_lokasi, l.nama_lokasi,
        j.id_jenis, j.nama_jamur,
        m.id_media, m.nama_media,
        u.id_user AS id_petugas, u.nama AS nama_petugas
     FROM budidaya b
     JOIN lokasi l ON b.id_lokasi = l.id_lokasi
     JOIN jenis_jamur j ON b.id_jenis = j.id_jenis
     JOIN media_tanam m ON b.id_media = m.id_media
     JOIN users u ON b.id_petugas = u.id_user
     WHERE b.id_budidaya = ?`,
    [id]
  );
  return rows[0] || null;
}

async function create({ id_lokasi, id_jenis, id_media, id_petugas, tanggal_mulai, status }) {
  const [result] = await db.query(
    `INSERT INTO budidaya (id_lokasi, id_jenis, id_media, id_petugas, tanggal_mulai, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id_lokasi, id_jenis, id_media, id_petugas, tanggal_mulai, status]
  );
  return result.insertId;
}

async function update(id, { id_lokasi, id_jenis, id_media, id_petugas, tanggal_mulai, status }) {
  const [result] = await db.query(
    `UPDATE budidaya
     SET id_lokasi = ?, id_jenis = ?, id_media = ?, id_petugas = ?, tanggal_mulai = ?, status = ?
     WHERE id_budidaya = ?`,
    [id_lokasi, id_jenis, id_media, id_petugas, tanggal_mulai, status, id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await db.query(`DELETE FROM budidaya WHERE id_budidaya = ?`, [id]);
  return result.affectedRows;
}


async function exists(id_budidaya) {
  const [rows] = await db.query(
    "SELECT id_budidaya FROM budidaya WHERE id_budidaya = ? LIMIT 1",
    [id_budidaya]
  );
  return rows.length > 0;
}

async function getByLokasi(id_lokasi) {
  const [rows] = await db.query(
    `SELECT
        b.id_budidaya,
        b.tanggal_mulai,
        b.status,
        j.nama_jamur AS jenis
     FROM budidaya b
     JOIN jenis_jamur j ON b.id_jenis = j.id_jenis
     WHERE b.id_lokasi = ?
     ORDER BY b.tanggal_mulai DESC`,
    [id_lokasi]
  );
  return rows;
}

async function getByPetugas(id_petugas) {
  const [rows] = await db.query(
    `SELECT 
        b.id_budidaya,
        b.tanggal_mulai,
        b.status,
        l.id_lokasi, l.nama_lokasi,
        j.id_jenis, j.nama_jamur,
        m.id_media, m.nama_media,
        u.id_user AS id_petugas, u.nama AS nama_petugas
     FROM budidaya b
     JOIN lokasi l ON b.id_lokasi = l.id_lokasi
     JOIN jenis_jamur j ON b.id_jenis = j.id_jenis
     JOIN media_tanam m ON b.id_media = m.id_media
     JOIN users u ON b.id_petugas = u.id_user
     WHERE b.id_petugas = ?
     ORDER BY b.id_budidaya DESC`,
    [id_petugas]
  );
  return rows;
}

async function getSummary() {
  const [rows] = await db.query(
    `SELECT 
        b.id_budidaya,
        b.tanggal_mulai,
        b.status,
        l.nama_lokasi,
        j.nama_jamur,
        m.nama_media,
        u.nama AS nama_petugas,
        COUNT(DISTINCT p.id_pertumbuhan) AS total_pengamatan,
        COALESCE(SUM(pa.jumlah_panen), 0) AS total_panen
     FROM budidaya b
     JOIN lokasi l ON b.id_lokasi = l.id_lokasi
     JOIN jenis_jamur j ON b.id_jenis = j.id_jenis
     JOIN media_tanam m ON b.id_media = m.id_media
     JOIN users u ON b.id_petugas = u.id_user
     LEFT JOIN pertumbuhan p ON p.id_budidaya = b.id_budidaya
     LEFT JOIN panen pa ON pa.id_budidaya = b.id_budidaya
     GROUP BY b.id_budidaya
     ORDER BY b.id_budidaya DESC`
  );
  return rows;
}

module.exports = { getAll, getById, create, update, remove, exists, getByLokasi, getByPetugas, getSummary };