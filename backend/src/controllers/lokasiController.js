const lokasiModel = require("../models/lokasiModel");

exports.getAll = async (req, res) => {
  const data = await lokasiModel.getAllLokasi();
  res.json({ success: true, data });
};

exports.getById = async (req, res) => {
  const id = Number(req.params.id);
  const lokasi = await lokasiModel.getLokasiById(id);
  if (!lokasi) {
    return res.status(404).json({ success: false, message: "Lokasi tidak ditemukan" });
  }
  res.json({ success: true, data: lokasi });
};

exports.create = async (req, res) => {
  const { nama_lokasi, alamat, jumlah_rak, keterangan } = req.body;

  if (!nama_lokasi) {
    return res.status(400).json({ success: false, message: "nama_lokasi wajib diisi" });
  }

  const idBaru = await lokasiModel.createLokasi({ nama_lokasi, alamat, jumlah_rak, keterangan });
  res.status(201).json({ success: true, message: "Lokasi berhasil dibuat", data: { id_lokasi: idBaru } });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const { nama_lokasi, alamat, jumlah_rak, keterangan } = req.body;

  if (!nama_lokasi) {
    return res.status(400).json({ success: false, message: "nama_lokasi wajib diisi" });
  }

  const affected = await lokasiModel.updateLokasi(id, { nama_lokasi, alamat, jumlah_rak, keterangan });
  if (affected === 0) {
    return res.status(404).json({ success: false, message: "Lokasi tidak ditemukan" });
  }

  res.json({ success: true, message: "Lokasi berhasil diupdate" });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const affected = await lokasiModel.deleteLokasi(id);

  if (affected === 0) {
    return res.status(404).json({ success: false, message: "Lokasi tidak ditemukan" });
  }

  res.json({ success: true, message: "Lokasi berhasil dihapus" });
};