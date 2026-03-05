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
  const { id_budidaya, tanggal_pengamatan, fase, suhu, kelembaban, intensitas_cahaya, catatan } = req.body;

  if (!id_budidaya || !tanggal_pengamatan) {
    return res.status(400).json({ success: false, message: "id_budidaya dan tanggal_pengamatan wajib diisi" });
  }

  if (!(await budidayaModel.exists(id_budidaya))) {
    return res.status(400).json({ success: false, message: "Budidaya tidak valid" });
  }

  // ambil petugas dari token (yang login)
  // agar petugas tidak bisa ngisi id_petugas orang lain
  const id_petugas = req.user.id_user;

  // pastikan yang login memang petugas atau admin
  if (req.user.role === "petugas") {
    if (!(await existsPetugas(id_petugas))) {
      return res.status(400).json({ success: false, message: "Akun ini bukan petugas valid" });
    }
  }

  const newId = await pertumbuhanModel.create({
    id_budidaya,
    id_petugas,
    tanggal_pengamatan,
    fase,
    suhu,
    kelembaban,
    intensitas_cahaya,
    catatan,
  });

  res.status(201).json({ success: true, message: "Pertumbuhan berhasil dicatat", data: { id_pertumbuhan: newId } });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const { id_budidaya, tanggal_pengamatan, fase, suhu, kelembaban, intensitas_cahaya, catatan } = req.body;

  if (!id_budidaya || !tanggal_pengamatan) {
    return res.status(400).json({ success: false, message: "id_budidaya dan tanggal_pengamatan wajib diisi" });
  }

  if (!(await budidayaModel.exists(id_budidaya))) {
    return res.status(400).json({ success: false, message: "Budidaya tidak valid" });
  }

  const id_petugas = req.user.id_user;

  const affected = await pertumbuhanModel.update(id, {
    id_budidaya,
    id_petugas,
    tanggal_pengamatan,
    fase,
    suhu,
    kelembaban,
    intensitas_cahaya,
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