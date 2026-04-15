const { db } = require("../config/db");

async function getAll() {
  const [rows] = await db.query(
    `SELECT 
        p.id_pertumbuhan,
        p.id_budidaya,
        p.id_petugas,
        u.nama AS nama_petugas,
        p.tanggal_pengamatan,
        p.fase,
        p.suhu,
        p.kelembaban,
        p.intensitas_cahaya,
        p.catatan
     FROM pertumbuhan p
     JOIN users u ON p.id_petugas = u.id_user
     ORDER BY p.id_pertumbuhan DESC`
  );
  return rows;
}

async function getById(id) {
  const [rows] = await db.query(
    `SELECT 
        p.id_pertumbuhan,
        p.id_budidaya,
        p.id_petugas,
        u.nama AS nama_petugas,
        p.tanggal_pengamatan,
        p.fase,
        p.suhu,
        p.kelembaban,
        p.intensitas_cahaya,
        p.catatan
     FROM pertumbuhan p
     JOIN users u ON p.id_petugas = u.id_user
     WHERE p.id_pertumbuhan = ?`,
    [id]
  );
  return rows[0] || null;
}

async function getByBudidaya(id_budidaya) {
  const [rows] = await db.query(
    `SELECT 
        p.id_pertumbuhan,
        p.id_budidaya,
        p.id_petugas,
        u.nama AS nama_petugas,
        p.tanggal_pengamatan,
        p.fase,
        p.suhu,
        p.kelembaban,
        p.intensitas_cahaya,
        p.catatan
     FROM pertumbuhan p
     JOIN users u ON p.id_petugas = u.id_user
     WHERE p.id_budidaya = ?
     ORDER BY p.tanggal_pengamatan ASC`,
    [id_budidaya]
  );
  return rows;
}

async function create(data) {
  const {
    id_budidaya,
    id_petugas,
    tanggal_pengamatan,
    fase,
    suhu,
    kelembaban,
    intensitas_cahaya,
    catatan,
  } = data;

  const [result] = await db.query(
    `INSERT INTO pertumbuhan
     (id_budidaya, id_petugas, tanggal_pengamatan, fase, suhu, kelembaban, intensitas_cahaya, catatan)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id_budidaya,
      id_petugas,
      tanggal_pengamatan,
      fase || null,
      suhu ?? null,
      kelembaban ?? null,
      intensitas_cahaya ?? null,
      catatan || null,
    ]
  );

  return result.insertId;
}

async function update(id, data) {
  const {
    id_budidaya,
    id_petugas,
    tanggal_pengamatan,
    fase,
    suhu,
    kelembaban,
    intensitas_cahaya,
    catatan,
  } = data;

  const [result] = await db.query(
    `UPDATE pertumbuhan
     SET id_budidaya = ?, id_petugas = ?, tanggal_pengamatan = ?, fase = ?, suhu = ?, kelembaban = ?, intensitas_cahaya = ?, catatan = ?
     WHERE id_pertumbuhan = ?`,
    [
      id_budidaya,
      id_petugas,
      tanggal_pengamatan,
      fase || null,
      suhu ?? null,
      kelembaban ?? null,
      intensitas_cahaya ?? null,
      catatan || null,
      id,
    ]
  );

  return result.affectedRows;
}

async function getByLokasi(id_lokasi) {
  const [rows] = await db.query(
    `SELECT
        p.id_pertumbuhan,
        p.id_budidaya,
        p.id_petugas,
        u.nama AS nama_petugas,
        p.tanggal_pengamatan,
        p.fase,
        p.suhu,
        p.kelembaban,
        p.intensitas_cahaya,
        p.catatan
     FROM pertumbuhan p
     JOIN budidaya b ON p.id_budidaya = b.id_budidaya
     JOIN users u ON p.id_petugas = u.id_user
     WHERE b.id_lokasi = ?
     ORDER BY p.tanggal_pengamatan ASC`,
    [id_lokasi]
  );
  return rows;
}

async function remove(id) {
  const [result] = await db.query(
    "DELETE FROM pertumbuhan WHERE id_pertumbuhan = ?",
    [id]
  );
  return result.affectedRows;
}

module.exports = { getAll, getById, getByBudidaya, getByLokasi, create, update, remove };