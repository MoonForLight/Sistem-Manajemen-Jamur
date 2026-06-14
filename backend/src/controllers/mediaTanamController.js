const mediaTanamModel = require("../models/mediaTanamModel");

function validateKadarAir(value) {
  if (value === undefined || value === null || value === '') return { value: null };
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 100) return { error: 'Kadar air optimal harus berupa angka 0-100' };
  return { value: number };
}

exports.getAll = async (_req, res) => res.json({ success: true, data: await mediaTanamModel.getAll() });
exports.getById = async (req, res) => {
  const item = await mediaTanamModel.getById(Number(req.params.id));
  if (!item) return res.status(404).json({ success: false, message: "Media tanam tidak ditemukan" });
  res.json({ success: true, data: item });
};

async function save(req, res, id = null) {
  const nama_media = String(req.body.nama_media || '').trim();
  if (!nama_media) return res.status(400).json({ success: false, message: "nama_media wajib diisi" });
  const kadar = validateKadarAir(req.body.kadar_air_optimal);
  if (kadar.error) return res.status(400).json({ success: false, message: kadar.error });
  const payload = { nama_media, kadar_air_optimal: kadar.value, catatan: req.body.catatan || null };
  if (id === null) {
    const idBaru = await mediaTanamModel.create(payload);
    return res.status(201).json({ success: true, message: "Media tanam berhasil dibuat", data: { id_media: idBaru } });
  }
  const affected = await mediaTanamModel.update(id, payload);
  if (!affected) return res.status(404).json({ success: false, message: "Media tanam tidak ditemukan" });
  return res.json({ success: true, message: "Media tanam berhasil diupdate" });
}

exports.create = (req, res) => save(req, res);
exports.update = (req, res) => save(req, res, Number(req.params.id));
exports.remove = async (req, res) => {
  const affected = await mediaTanamModel.remove(Number(req.params.id));
  if (!affected) return res.status(404).json({ success: false, message: "Media tanam tidak ditemukan" });
  res.json({ success: true, message: "Media tanam berhasil dihapus" });
};
