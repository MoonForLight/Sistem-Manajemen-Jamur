const budidayaModel = require("../models/budidayaModel");
const lokasiModel = require("../models/lokasiModel");
const jenisJamurModel = require("../models/jenisJamurModel");
const mediaTanamModel = require("../models/mediaTanamModel");

// helper cek petugas
const { db } = require("../config/db");
async function existsPetugas(id_petugas) {
  const [rows] = await db.query("SELECT id_user FROM petugas WHERE id_user = ? LIMIT 1", [id_petugas]);
  return rows.length > 0;
}

exports.getAll = async (req, res) => {
  const data = await budidayaModel.getAll();
  res.json({ success: true, data });
};

exports.getById = async (req, res) => {
  const id = Number(req.params.id);
  const item = await budidayaModel.getById(id);
  if (!item) {
    return res.status(404).json({ success: false, message: "Budidaya tidak ditemukan" });
  }
  res.json({ success: true, data: item });
};

exports.create = async (req, res) => {
  const { id_lokasi, id_jenis, id_media, tanggal_mulai, status, catatan, id_petugas } = req.body;

  // validasi minimal
  if (!id_lokasi || !id_jenis || !id_media || !tanggal_mulai || !id_petugas) {
    return res.status(400).json({
      success: false,
      message: "id_lokasi, id_jenis, id_media, tanggal_mulai, id_petugas wajib diisi",
    });
  }

  // validasi referensi
  if (!(await lokasiModel.existsLokasi(id_lokasi))) {
    return res.status(400).json({ success: false, message: "Lokasi tidak valid" });
  }
  if (!(await jenisJamurModel.exists(id_jenis))) {
    return res.status(400).json({ success: false, message: "Jenis jamur tidak valid" });
  }
  if (!(await mediaTanamModel.exists(id_media))) {
    return res.status(400).json({ success: false, message: "Media tanam tidak valid" });
  }
  if (!(await existsPetugas(id_petugas))) {
    return res.status(400).json({ success: false, message: "Petugas tidak valid" });
  }

  const newId = await budidayaModel.create({
    id_lokasi,
    id_jenis,
    id_media,
    id_petugas,
    tanggal_mulai,
    status: status || "inisiasi",
    catatan: catatan || null,
  });

  res.status(201).json({
    success: true,
    message: "Budidaya berhasil dibuat",
    data: { id_budidaya: newId },
  });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const { id_lokasi, id_jenis, id_media, id_petugas, tanggal_mulai, status } = req.body;

  if (!id_lokasi || !id_jenis || !id_media || !id_petugas || !tanggal_mulai) {
    return res.status(400).json({
      success: false,
      message: "id_lokasi, id_jenis, id_media, id_petugas, tanggal_mulai wajib diisi",
    });
  }

  if (!(await lokasiModel.existsLokasi(id_lokasi))) {
    return res.status(400).json({ success: false, message: "Lokasi tidak valid" });
  }
  if (!(await jenisJamurModel.exists(id_jenis))) {
    return res.status(400).json({ success: false, message: "Jenis jamur tidak valid" });
  }
  if (!(await mediaTanamModel.exists(id_media))) {
    return res.status(400).json({ success: false, message: "Media tanam tidak valid" });
  }
  if (!(await existsPetugas(id_petugas))) {
    return res.status(400).json({ success: false, message: "Petugas tidak valid" });
  }

  const affected = await budidayaModel.update(id, {
    id_lokasi,
    id_jenis,
    id_media,
    id_petugas,
    tanggal_mulai,
    status: status || "aktif",
  });

  if (affected === 0) {
    return res.status(404).json({ success: false, message: "Budidaya tidak ditemukan" });
  }

  res.json({ success: true, message: "Budidaya berhasil diupdate" });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const affected = await budidayaModel.remove(id);

  if (affected === 0) {
    return res.status(404).json({ success: false, message: "Budidaya tidak ditemukan" });
  }

  res.json({ success: true, message: "Budidaya berhasil dihapus" });
};

exports.getByPetugas = async (req, res) => {
  const id_petugas = req.user.id_user;
  const data = await budidayaModel.getByPetugas(id_petugas);
  res.json({ success: true, data });
};

exports.getSummary = async (req, res) => {
  const data = await budidayaModel.getSummary();
  res.json({ success: true, data });
};