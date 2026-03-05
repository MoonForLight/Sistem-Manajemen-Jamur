const { db } = require("../config/db");

async function getAllLokasi() {
  const [rows] = await db.query(
    "SELECT id_lokasi, nama_lokasi, alamat, jumlah_rak, keterangan FROM lokasi ORDER BY id_lokasi DESC"
  );
  return rows;
}

async function getLokasiById(id) {
  const [rows] = await db.query(
    "SELECT id_lokasi, nama_lokasi, alamat, jumlah_rak, keterangan FROM lokasi WHERE id_lokasi = ?",
    [id]
  );
  return rows[0] || null;
}

async function createLokasi({ nama_lokasi, alamat, jumlah_rak, keterangan }) {
  const [result] = await db.query(
    "INSERT INTO lokasi (nama_lokasi, alamat, jumlah_rak, keterangan) VALUES (?, ?, ?, ?)",
    [nama_lokasi, alamat || null, jumlah_rak ?? 0, keterangan || null]
  );
  return result.insertId;
}

async function updateLokasi(id, { nama_lokasi, alamat, jumlah_rak, keterangan }) {
  const [result] = await db.query(
    "UPDATE lokasi SET nama_lokasi = ?, alamat = ?, jumlah_rak = ?, keterangan = ? WHERE id_lokasi = ?",
    [nama_lokasi, alamat || null, jumlah_rak ?? 0, keterangan || null, id]
  );
  return result.affectedRows;
}

async function deleteLokasi(id) {
  const [result] = await db.query("DELETE FROM lokasi WHERE id_lokasi = ?", [id]);
  return result.affectedRows;
}

async function existsLokasi(id_lokasi) {
  const [rows] = await db.query(
    "SELECT id_lokasi FROM lokasi WHERE id_lokasi = ? LIMIT 1",
    [id_lokasi]
  );
  return rows.length > 0;
}

module.exports = {
  getAllLokasi,
  getLokasiById,
  createLokasi,
  updateLokasi,
  deleteLokasi,
  existsLokasi,
};