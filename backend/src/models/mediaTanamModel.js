const { db } = require("../config/db");

async function getAll() {
  const [rows] = await db.query(
    `SELECT id_media, nama_media, kadar_air_optimal, catatan
     FROM media_tanam
     ORDER BY id_media DESC`
  );
  return rows;
}

async function getById(id) {
  const [rows] = await db.query(
    `SELECT id_media, nama_media, kadar_air_optimal, catatan
     FROM media_tanam
     WHERE id_media = ?`,
    [id]
  );
  return rows[0] || null;
}

async function create(data) {
  const { nama_media, kadar_air_optimal, catatan } = data;
  const [result] = await db.query(
    `INSERT INTO media_tanam (nama_media, kadar_air_optimal, catatan)
     VALUES (?, ?, ?)`,
    [nama_media, kadar_air_optimal ?? null, catatan || null]
  );
  return result.insertId;
}

async function update(id, data) {
  const { nama_media, kadar_air_optimal, catatan } = data;
  const [result] = await db.query(
    `UPDATE media_tanam
     SET nama_media = ?, kadar_air_optimal = ?, catatan = ?
     WHERE id_media = ?`,
    [nama_media, kadar_air_optimal ?? null, catatan || null, id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await db.query(
    `DELETE FROM media_tanam WHERE id_media = ?`,
    [id]
  );
  return result.affectedRows;
}

async function exists(id) {
  const [rows] = await db.query(
    "SELECT id_media FROM media_tanam WHERE id_media = ? LIMIT 1",
    [id]
  );
  return rows.length > 0;
}

module.exports = { getAll, getById, create, update, remove, exists };