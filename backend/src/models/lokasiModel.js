const { db } = require("../config/db");

async function getAllLokasi() {
  const [rows] = await db.query(
    "SELECT id_lokasi, nama_lokasi, alamat, jumlah_rak, keterangan, foto_lokasi FROM lokasi ORDER BY id_lokasi DESC"
  );
  return rows;
}

async function getLokasiById(id) {
  const [rows] = await db.query(
    "SELECT id_lokasi, nama_lokasi, alamat, jumlah_rak, keterangan, foto_lokasi FROM lokasi WHERE id_lokasi = ?",
    [id]
  );
  return rows[0] || null;
}

async function createLokasi({ nama_lokasi, alamat, jumlah_rak, keterangan, foto_lokasi }) {
  const [result] = await db.query(
    "INSERT INTO lokasi (nama_lokasi, alamat, jumlah_rak, keterangan, foto_lokasi) VALUES (?, ?, ?, ?, ?)",
    [nama_lokasi, alamat || null, jumlah_rak ?? 0, keterangan || null, foto_lokasi || null]
  );
  return result.insertId;
}

async function updateLokasi(id, { nama_lokasi, alamat, jumlah_rak, keterangan, foto_lokasi }) {
  if (foto_lokasi !== undefined) {
    const [result] = await db.query(
      "UPDATE lokasi SET nama_lokasi = ?, alamat = ?, jumlah_rak = ?, keterangan = ?, foto_lokasi = ? WHERE id_lokasi = ?",
      [nama_lokasi, alamat || null, jumlah_rak ?? 0, keterangan || null, foto_lokasi, id]
    );
    return result.affectedRows;
  } else {
    const [result] = await db.query(
      "UPDATE lokasi SET nama_lokasi = ?, alamat = ?, jumlah_rak = ?, keterangan = ? WHERE id_lokasi = ?",
      [nama_lokasi, alamat || null, jumlah_rak ?? 0, keterangan || null, id]
    );
    return result.affectedRows;
  }
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