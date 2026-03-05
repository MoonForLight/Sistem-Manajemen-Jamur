const { db } = require("../config/db");

async function getAll() {
  const [rows] = await db.query(
    `SELECT 
        pa.id_panen,
        pa.id_budidaya,
        pa.id_petugas,
        u.nama AS nama_petugas,
        pa.tanggal_panen,
        pa.jumlah_panen,
        pa.catatan
     FROM panen pa
     JOIN users u ON pa.id_petugas = u.id_user
     ORDER BY pa.id_panen DESC`
  );
  return rows;
}

async function getById(id) {
  const [rows] = await db.query(
    `SELECT 
        pa.id_panen,
        pa.id_budidaya,
        pa.id_petugas,
        u.nama AS nama_petugas,
        pa.tanggal_panen,
        pa.jumlah_panen,
        pa.catatan
     FROM panen pa
     JOIN users u ON pa.id_petugas = u.id_user
     WHERE pa.id_panen = ?`,
    [id]
  );
  return rows[0] || null;
}

async function getByBudidaya(id_budidaya) {
  const [rows] = await db.query(
    `SELECT 
        pa.id_panen,
        pa.id_budidaya,
        pa.id_petugas,
        u.nama AS nama_petugas,
        pa.tanggal_panen,
        pa.jumlah_panen,
        pa.catatan
     FROM panen pa
     JOIN users u ON pa.id_petugas = u.id_user
     WHERE pa.id_budidaya = ?
     ORDER BY pa.tanggal_panen ASC`,
    [id_budidaya]
  );
  return rows;
}

async function create(data) {
  const { id_budidaya, id_petugas, tanggal_panen, jumlah_panen, catatan } = data;
  const [result] = await db.query(
    `INSERT INTO panen (id_budidaya, id_petugas, tanggal_panen, jumlah_panen, catatan)
     VALUES (?, ?, ?, ?, ?)`,
    [id_budidaya, id_petugas, tanggal_panen, jumlah_panen, catatan || null]
  );
  return result.insertId;
}

async function update(id, data) {
  const { id_budidaya, id_petugas, tanggal_panen, jumlah_panen, catatan } = data;
  const [result] = await db.query(
    `UPDATE panen
     SET id_budidaya = ?, id_petugas = ?, tanggal_panen = ?, jumlah_panen = ?, catatan = ?
     WHERE id_panen = ?`,
    [id_budidaya, id_petugas, tanggal_panen, jumlah_panen, catatan || null, id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await db.query("DELETE FROM panen WHERE id_panen = ?", [id]);
  return result.affectedRows;
}

module.exports = { getAll, getById, getByBudidaya, create, update, remove };