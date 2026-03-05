const jenisJamurModel = require("../models/jenisJamurModel");

exports.getAll = async (req, res) => {
  const data = await jenisJamurModel.getAll();
  res.json({ success: true, data });
};

exports.getById = async (req, res) => {
  const id = Number(req.params.id);
  const item = await jenisJamurModel.getById(id);

  if (!item) {
    return res.status(404).json({ success: false, message: "Jenis jamur tidak ditemukan" });
  }

  res.json({ success: true, data: item });
};

exports.create = async (req, res) => {
  const { nama_jamur, genus, suhu_optimal, kelembapan_optimal } = req.body;

  if (!nama_jamur) {
    return res.status(400).json({ success: false, message: "nama_jamur wajib diisi" });
  }

  const idBaru = await jenisJamurModel.create({ nama_jamur, genus, suhu_optimal, kelembapan_optimal });
  res.status(201).json({ success: true, message: "Jenis jamur berhasil dibuat", data: { id_jenis: idBaru } });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const { nama_jamur, genus, suhu_optimal, kelembapan_optimal } = req.body;

  if (!nama_jamur) {
    return res.status(400).json({ success: false, message: "nama_jamur wajib diisi" });
  }

  const affected = await jenisJamurModel.update(id, { nama_jamur, genus, suhu_optimal, kelembapan_optimal });

  if (affected === 0) {
    return res.status(404).json({ success: false, message: "Jenis jamur tidak ditemukan" });
  }

  res.json({ success: true, message: "Jenis jamur berhasil diupdate" });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const affected = await jenisJamurModel.remove(id);

  if (affected === 0) {
    return res.status(404).json({ success: false, message: "Jenis jamur tidak ditemukan" });
  }

  res.json({ success: true, message: "Jenis jamur berhasil dihapus" });
};