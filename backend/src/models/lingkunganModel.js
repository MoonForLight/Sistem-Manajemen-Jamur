const { db } = require("../config/db");

async function getAll() {
  const [rows] = await db.query(
    `SELECT 
        l.id_lingkungan,
        l.id_budidaya,
        l.id_petugas,
        u.nama AS nama_petugas,
        l.tanggal_pengukuran,
        l.suhu,
        l.kelembaban,
        l.intensitas_cahaya
     FROM lingkungan_harian l
     JOIN users u ON l.id_petugas = u.id_user
     ORDER BY l.tanggal_pengukuran DESC, l.id_lingkungan DESC`
  );
  return rows;
}

async function getById(id) {
  const [rows] = await db.query(
    `SELECT 
        l.id_lingkungan,
        l.id_budidaya,
        l.id_petugas,
        u.nama AS nama_petugas,
        l.tanggal_pengukuran,
        l.suhu,
        l.kelembaban,
        l.intensitas_cahaya
     FROM lingkungan_harian l
     JOIN users u ON l.id_petugas = u.id_user
     WHERE l.id_lingkungan = ?`,
    [id]
  );
  return rows[0] || null;
}

async function getByBudidaya(id_budidaya) {
  const [rows] = await db.query(
    `SELECT 
        l.id_lingkungan,
        l.id_budidaya,
        l.id_petugas,
        u.nama AS nama_petugas,
        l.tanggal_pengukuran,
        l.suhu,
        l.kelembaban,
        l.intensitas_cahaya
     FROM lingkungan_harian l
     JOIN users u ON l.id_petugas = u.id_user
     WHERE l.id_budidaya = ?
     ORDER BY l.tanggal_pengukuran ASC`,
    [id_budidaya]
  );
  return rows;
}

async function create(data) {
  const {
    id_budidaya,
    id_petugas,
    tanggal_pengukuran,
    suhu,
    kelembaban,
    intensitas_cahaya
  } = data;

  const [result] = await db.query(
    `INSERT INTO lingkungan_harian
     (id_budidaya, id_petugas, tanggal_pengukuran, suhu, kelembaban, intensitas_cahaya)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id_budidaya,
      id_petugas,
      tanggal_pengukuran,
      suhu || null,
      kelembaban || null,
      intensitas_cahaya || null,
    ]
  );

  return result.insertId;
}

async function update(id, data) {
  const {
    id_budidaya,
    id_petugas,
    tanggal_pengukuran,
    suhu,
    kelembaban,
    intensitas_cahaya
  } = data;

  const [result] = await db.query(
    `UPDATE lingkungan_harian
     SET id_budidaya = ?, id_petugas = ?, tanggal_pengukuran = ?, suhu = ?, kelembaban = ?, intensitas_cahaya = ?
     WHERE id_lingkungan = ?`,
    [
      id_budidaya,
      id_petugas,
      tanggal_pengukuran,
      suhu || null,
      kelembaban || null,
      intensitas_cahaya || null,
      id,
    ]
  );

  return result.affectedRows;
}

async function getByLokasi(id_lokasi) {
  const [rows] = await db.query(
    `SELECT
        l.id_lingkungan,
        l.id_budidaya,
        l.id_petugas,
        u.nama AS nama_petugas,
        l.tanggal_pengukuran,
        l.suhu,
        l.kelembaban,
        l.intensitas_cahaya
     FROM lingkungan_harian l
     JOIN budidaya b ON l.id_budidaya = b.id_budidaya
     JOIN users u ON l.id_petugas = u.id_user
     WHERE b.id_lokasi = ?
     ORDER BY l.tanggal_pengukuran ASC`,
    [id_lokasi]
  );
  return rows;
}

async function remove(id) {
  const [result] = await db.query(
    "DELETE FROM lingkungan_harian WHERE id_lingkungan = ?",
    [id]
  );
  return result.affectedRows;
}

module.exports = { getAll, getById, getByBudidaya, getByLokasi, create, update, remove };
