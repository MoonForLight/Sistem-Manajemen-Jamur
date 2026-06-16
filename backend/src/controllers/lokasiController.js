const lokasiModel = require("../models/lokasiModel");
const { db } = require("../config/db");

function validateJumlahRak(value) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 && number <= 10000 ? number : null;
}

exports.getAll = async (_req, res) => {
  const data = await lokasiModel.getAllLokasi();
  res.json({ success: true, data });
};

exports.getById = async (req, res) => {
  const id = Number(req.params.id);
  const lokasi = await lokasiModel.getLokasiById(id);
  if (!lokasi) return res.status(404).json({ success: false, message: "Lokasi tidak ditemukan" });
  res.json({ success: true, data: lokasi });
};

exports.create = async (req, res) => {
  const { nama_lokasi, alamat, keterangan, foto_lokasi } = req.body;
  const jumlah_rak = validateJumlahRak(req.body.jumlah_rak ?? 0);
  if (!String(nama_lokasi || '').trim()) return res.status(400).json({ success: false, message: "nama_lokasi wajib diisi" });
  if (jumlah_rak === null) return res.status(400).json({ success: false, message: "Jumlah rak harus bilangan bulat 0-10000" });
  const idBaru = await lokasiModel.createLokasi({ nama_lokasi: String(nama_lokasi).trim(), alamat, jumlah_rak, keterangan, foto_lokasi });
  res.status(201).json({ success: true, message: "Lokasi berhasil dibuat", data: { id_lokasi: idBaru } });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const { nama_lokasi, alamat, keterangan, foto_lokasi } = req.body;
  const jumlah_rak = validateJumlahRak(req.body.jumlah_rak ?? 0);
  if (!String(nama_lokasi || '').trim()) return res.status(400).json({ success: false, message: "nama_lokasi wajib diisi" });
  if (jumlah_rak === null) return res.status(400).json({ success: false, message: "Jumlah rak harus bilangan bulat 0-10000" });
  const affected = await lokasiModel.updateLokasi(id, { nama_lokasi: String(nama_lokasi).trim(), alamat, jumlah_rak, keterangan, foto_lokasi });
  if (affected === 0) return res.status(404).json({ success: false, message: "Lokasi tidak ditemukan" });
  res.json({ success: true, message: "Lokasi berhasil diupdate" });
};

exports.getBackupData = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const lokasi = await lokasiModel.getLokasiById(id);
    if (!lokasi) return res.status(404).json({ success: false, message: "Lokasi tidak ditemukan" });

    const [budidayaList] = await db.query('SELECT * FROM budidaya WHERE id_lokasi = ?', [id]);
    
    // For each budidaya, fetch panen, lingkungan, pertumbuhan
    for (let b of budidayaList) {
      const [panen] = await db.query('SELECT * FROM panen WHERE id_budidaya = ?', [b.id_budidaya]);
      const [lingkungan] = await db.query('SELECT * FROM lingkungan_harian WHERE id_budidaya = ? ORDER BY tanggal_pengukuran ASC', [b.id_budidaya]);
      const [pertumbuhan] = await db.query('SELECT * FROM pertumbuhan WHERE id_budidaya = ? ORDER BY tanggal_pengamatan ASC', [b.id_budidaya]);
      b.panen = panen;
      b.lingkungan = lingkungan;
      b.pertumbuhan = pertumbuhan;
    }

    res.json({ success: true, data: { lokasi, budidaya: budidayaList } });
  } catch (error) {
    console.error("Error getting backup data:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data backup" });
  }
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const force = req.query.force === 'true';

  if (force) {
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      // Get budidaya IDs
      const [budidayaRows] = await connection.query('SELECT id_budidaya FROM budidaya WHERE id_lokasi = ?', [id]);
      const budidayaIds = budidayaRows.map(row => row.id_budidaya);

      if (budidayaIds.length > 0) {
        await connection.query('DELETE FROM panen WHERE id_budidaya IN (?)', [budidayaIds]);
        await connection.query('DELETE FROM lingkungan_harian WHERE id_budidaya IN (?)', [budidayaIds]);
        await connection.query('DELETE FROM pertumbuhan WHERE id_budidaya IN (?)', [budidayaIds]);
        await connection.query('DELETE FROM budidaya WHERE id_lokasi = ?', [id]);
      }
      
      const [result] = await connection.query('DELETE FROM lokasi WHERE id_lokasi = ?', [id]);
      
      await connection.commit();
      
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Lokasi tidak ditemukan" });
      return res.json({ success: true, message: "Lokasi dan seluruh datanya berhasil dihapus secara permanen" });
    } catch (error) {
      if (connection) await connection.rollback();
      console.error("Error force deleting lokasi:", error);
      return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server saat menghapus lokasi" });
    } finally {
      if (connection) connection.release();
    }
  }

  try {
    const affected = await lokasiModel.deleteLokasi(id);
    if (affected === 0) return res.status(404).json({ success: false, message: "Lokasi tidak ditemukan" });
    res.json({ success: true, message: "Lokasi berhasil dihapus" });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({ success: false, message: "Gagal menghapus: Lokasi ini sedang digunakan pada data budidaya aktif atau riwayat budidaya." });
    }
    console.error("Error deleting lokasi:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server saat menghapus lokasi" });
  }
};
