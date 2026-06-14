const lokasiModel = require("../models/lokasiModel");

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

exports.remove = async (req, res) => {
  const affected = await lokasiModel.deleteLokasi(Number(req.params.id));
  if (affected === 0) return res.status(404).json({ success: false, message: "Lokasi tidak ditemukan" });
  res.json({ success: true, message: "Lokasi berhasil dihapus" });
};
