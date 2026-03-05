const { db } = require("../config/db");

async function getAll() {
  const [rows] = await db.query(
    `SELECT id_jenis, nama_jamur, genus, suhu_optimal, kelembapan_optimal
     FROM jenis_jamur
     ORDER BY id_jenis DESC`
  );
  return rows;
}

async function getById(id) {
  const [rows] = await db.query(
    `SELECT id_jenis, nama_jamur, genus, suhu_optimal, kelembapan_optimal
     FROM jenis_jamur
     WHERE id_jenis = ?`,
    [id]
  );
  return rows[0] || null;
}

async function create(data) {
  const { nama_jamur, genus, suhu_optimal, kelembapan_optimal } = data;
  const [result] = await db.query(
    `INSERT INTO jenis_jamur (nama_jamur, genus, suhu_optimal, kelembapan_optimal)
     VALUES (?, ?, ?, ?)`,
    [
      nama_jamur,
      genus || null,
      suhu_optimal ?? null,
      kelembapan_optimal ?? null,
    ]
  );
  return result.insertId;
}

async function update(id, data) {
  const { nama_jamur, genus, suhu_optimal, kelembapan_optimal } = data;
  const [result] = await db.query(
    `UPDATE jenis_jamur
     SET nama_jamur = ?, genus = ?, suhu_optimal = ?, kelembapan_optimal = ?
     WHERE id_jenis = ?`,
    [
      nama_jamur,
      genus || null,
      suhu_optimal ?? null,
      kelembapan_optimal ?? null,
      id,
    ]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await db.query(`DELETE FROM jenis_jamur WHERE id_jenis = ?`, [id]);
  return result.affectedRows;
}

async function exists(id) {
  const [rows] = await db.query(
    "SELECT id_jenis FROM jenis_jamur WHERE id_jenis = ? LIMIT 1",
    [id]
  );
  return rows.length > 0;
}

module.exports = { getAll, getById, create, update, remove, exists };