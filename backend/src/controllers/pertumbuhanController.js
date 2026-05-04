const pertumbuhanModel = require("../models/pertumbuhanModel");
const budidayaModel = require("../models/budidayaModel");

// helper cek petugas
const { db } = require("../config/db");
async function existsPetugas(id_petugas) {
  const [rows] = await db.query(
    "SELECT id_user FROM petugas WHERE id_user = ? LIMIT 1",
    [id_petugas]
  );
  return rows.length > 0;
}

exports.getAll = async (req, res) => {
  const data = await pertumbuhanModel.getAll();
  res.json({ success: true, data });
};

exports.getById = async (req, res) => {
  const id = Number(req.params.id);
  const item = await pertumbuhanModel.getById(id);
  if (!item) return res.status(404).json({ success: false, message: "Data pertumbuhan tidak ditemukan" });
  res.json({ success: true, data: item });
};

exports.getByBudidaya = async (req, res) => {
  const id_budidaya = Number(req.params.id_budidaya);
  const data = await pertumbuhanModel.getByBudidaya(id_budidaya);
  res.json({ success: true, data });
};

exports.create = async (req, res) => {
  const { id_budidaya, tanggal_pengamatan, fase, detail_fase, catatan } = req.body;

  if (!id_budidaya || !tanggal_pengamatan) {
    return res.status(400).json({ success: false, message: "id_budidaya dan tanggal_pengamatan wajib diisi" });
  }

  if (!(await budidayaModel.exists(id_budidaya))) {
    return res.status(400).json({ success: false, message: "Budidaya tidak valid" });
  }

  const id_petugas = Number(req.user.id_user);

  if (req.user.role === "petugas") {
    const bud = await budidayaModel.getById(id_budidaya);
    if (!bud || bud.id_petugas !== id_petugas) {
      return res.status(403).json({ success: false, message: "Anda tidak berwenang untuk mencatat pertumbuhan di budidaya ini" });
    }
    if (!(await existsPetugas(id_petugas))) {
      return res.status(400).json({ success: false, message: "Akun ini bukan petugas valid" });
    }
  }

  const newId = await pertumbuhanModel.create({
    id_budidaya,
    id_petugas,
    tanggal_pengamatan,
    fase,
    detail_fase,
    catatan,
  });

  res.status(201).json({ success: true, message: "Pertumbuhan berhasil dicatat", data: { id_pertumbuhan: newId } });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const { id_budidaya, tanggal_pengamatan, fase, detail_fase, catatan } = req.body;

  if (!id_budidaya || !tanggal_pengamatan) {
    return res.status(400).json({ success: false, message: "id_budidaya dan tanggal_pengamatan wajib diisi" });
  }

  if (!(await budidayaModel.exists(id_budidaya))) {
    return res.status(400).json({ success: false, message: "Budidaya tidak valid" });
  }

  const id_petugas = Number(req.user.id_user);
  if (req.user.role === "petugas") {
    const existing = await pertumbuhanModel.getById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Data pertumbuhan tidak ditemukan" });
    }
    if (existing.id_petugas !== id_petugas) {
      return res.status(403).json({ success: false, message: "Anda tidak berwenang mengubah pengamatan ini" });
    }
    const bud = await budidayaModel.getById(id_budidaya);
    if (!bud || bud.id_petugas !== id_petugas) {
      return res.status(403).json({ success: false, message: "Anda tidak berwenang untuk mengaitkan pengamatan dengan budidaya ini" });
    }
  }

  const affected = await pertumbuhanModel.update(id, {
    id_budidaya,
    id_petugas,
    tanggal_pengamatan,
    fase,
    detail_fase,
    catatan,
  });

  if (affected === 0) return res.status(404).json({ success: false, message: "Data pertumbuhan tidak ditemukan" });

  res.json({ success: true, message: "Pertumbuhan berhasil diupdate" });
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  const affected = await pertumbuhanModel.remove(id);
  if (affected === 0) return res.status(404).json({ success: false, message: "Data pertumbuhan tidak ditemukan" });
  res.json({ success: true, message: "Pertumbuhan berhasil dihapus" });
};