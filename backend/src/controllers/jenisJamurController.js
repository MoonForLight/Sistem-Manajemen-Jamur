const jenisJamurModel = require("../models/jenisJamurModel");

function optionalNumber(value, min, max, label) {
  if (value === undefined || value === null || value === '') return { value: null };
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) return { error: `${label} harus berupa angka ${min}-${max}` };
  return { value: number };
}

exports.getAll = async (_req, res) => res.json({ success: true, data: await jenisJamurModel.getAll() });
exports.getById = async (req, res) => {
  const item = await jenisJamurModel.getById(Number(req.params.id));
  if (!item) return res.status(404).json({ success: false, message: "Jenis jamur tidak ditemukan" });
  res.json({ success: true, data: item });
};

async function save(req, res, id = null) {
  const nama_jamur = String(req.body.nama_jamur || '').trim();
  const genus = String(req.body.genus || '').trim() || null;
  if (!nama_jamur) return res.status(400).json({ success: false, message: "nama_jamur wajib diisi" });
  const suhu = optionalNumber(req.body.suhu_optimal, 0, 60, 'Suhu optimal');
  const kelembapan = optionalNumber(req.body.kelembapan_optimal, 0, 100, 'Kelembapan optimal');
  if (suhu.error) return res.status(400).json({ success: false, message: suhu.error });
  if (kelembapan.error) return res.status(400).json({ success: false, message: kelembapan.error });
  const payload = { nama_jamur, genus, suhu_optimal: suhu.value, kelembapan_optimal: kelembapan.value };
  if (id === null) {
    const idBaru = await jenisJamurModel.create(payload);
    return res.status(201).json({ success: true, message: "Jenis jamur berhasil dibuat", data: { id_jenis: idBaru } });
  }
  const affected = await jenisJamurModel.update(id, payload);
  if (!affected) return res.status(404).json({ success: false, message: "Jenis jamur tidak ditemukan" });
  return res.json({ success: true, message: "Jenis jamur berhasil diupdate" });
}

exports.create = (req, res) => save(req, res);
exports.update = (req, res) => save(req, res, Number(req.params.id));
exports.remove = async (req, res) => {
  const affected = await jenisJamurModel.remove(Number(req.params.id));
  if (!affected) return res.status(404).json({ success: false, message: "Jenis jamur tidak ditemukan" });
  res.json({ success: true, message: "Jenis jamur berhasil dihapus" });
};
