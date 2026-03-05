const mediaTanamModel = require("../models/mediaTanamModel");

exports.getAll = async (req, res) => {
  const data = await mediaTanamModel.getAll();
  res.json({ success: true, data });
};

exports.getById = async (req, res) => {
  const id = Number(req.params.id);
  const item = await mediaTanamModel.getById(id);

  if (!item) {
    return res.status(404).json({ success: false, message: "Media tanam tidak ditemukan" });
  }

  res.json({ success: true, data: item });
};

exports.create = async (req, res) => {
  const { nama_media, kadar_air_optimal, catatan } = req.body;

  if (!nama_media) {
    return res.status(400).json({ success: false, message: "nama_media wajib diisi" });
  }

  const idBaru = await mediaTanamModel.create({ nama_media, kadar_air_optimal, catatan });
  res.status(201).json({
    success: true,
    message: "Media tanam berhasil dibuat",
    data: { id_media: idBaru },
  });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const { nama_media, kadar_air_optimal, catatan } = req.body;

  if (!nama_media) {
    return res.status(400).json({ success: false, message: "nama_media wajib diisi" });
  }

  const affected = await mediaTanamModel.update(id, { nama_media, kadar_air_optimal, catatan });
  if (affected === 0) {
    return res.status(404).json({ success: false, message: "Media tanam tidak ditemukan" });
  }

  res.json({ success: true, message: "Media tanam berhasil diupdate" });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const affected = await mediaTanamModel.remove(id);

  if (affected === 0) {
    return res.status(404).json({ success: false, message: "Media tanam tidak ditemukan" });
  }

  res.json({ success: true, message: "Media tanam berhasil dihapus" });
};