const pertumbuhanModel = require('../models/pertumbuhanModel');
const budidayaModel = require('../models/budidayaModel');
const { db } = require('../config/db');
const { getTodayISO, normalizeISODate } = require('../utils/date');

const ALLOWED_PHASES = new Set(['Inkubasi', 'Pinhead', 'Pembesaran', 'Panen']);

async function existsPetugas(id_petugas) {
  const [rows] = await db.query('SELECT id_user FROM petugas WHERE id_user = ? LIMIT 1', [id_petugas]);
  return rows.length > 0;
}

exports.getAll = async (_req, res) => {
  const data = await pertumbuhanModel.getAll();
  res.json({ success: true, data });
};

exports.getById = async (req, res) => {
  const item = await pertumbuhanModel.getById(Number(req.params.id));
  if (!item) return res.status(404).json({ success: false, message: 'Data pertumbuhan tidak ditemukan' });
  res.json({ success: true, data: item });
};

exports.getByBudidaya = async (req, res) => {
  const data = await pertumbuhanModel.getByBudidaya(Number(req.params.id_budidaya));
  res.json({ success: true, data });
};

exports.create = async (req, res) => {
  const id_budidaya = Number(req.body.id_budidaya);
  const tanggal_pengamatan = normalizeISODate(req.body.tanggal_pengamatan);
  const fase = String(req.body.fase || '').trim();
  const { detail_fase, catatan } = req.body;

  if (!id_budidaya || !tanggal_pengamatan || !fase) {
    return res.status(400).json({ success: false, message: 'id_budidaya, tanggal_pengamatan, dan fase wajib diisi' });
  }
  if (!ALLOWED_PHASES.has(fase)) {
    return res.status(400).json({ success: false, message: 'Fase pertumbuhan tidak valid' });
  }
  if (req.user.role === 'petugas' && tanggal_pengamatan !== getTodayISO()) {
    return res.status(403).json({ success: false, message: 'Petugas hanya dapat mengisi tanggal hari ini' });
  }

  const bud = await budidayaModel.getById(id_budidaya);
  if (!bud) return res.status(400).json({ success: false, message: 'Budidaya tidak valid' });

  const id_petugas = req.user.role === 'petugas'
    ? Number(req.user.id_user)
    : Number(req.body.id_petugas || bud.id_petugas);
  if (!(await existsPetugas(id_petugas))) {
    return res.status(400).json({ success: false, message: 'Petugas tidak valid' });
  }
  if (req.user.role === 'petugas' && Number(bud.id_petugas) !== id_petugas) {
    return res.status(403).json({ success: false, message: 'Anda tidak berwenang mencatat pertumbuhan di budidaya ini' });
  }

  const newId = await pertumbuhanModel.create({
    id_budidaya,
    id_petugas,
    tanggal_pengamatan,
    fase,
    detail_fase,
    catatan,
    foto: req.file?.filename || null,
  });

  res.status(201).json({
    success: true,
    message: 'Pertumbuhan berhasil dicatat',
    data: { id_pertumbuhan: newId, foto: req.file?.filename || null },
  });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const existing = await pertumbuhanModel.getById(id);
  if (!existing) return res.status(404).json({ success: false, message: 'Data pertumbuhan tidak ditemukan' });

  const id_budidaya = Number(req.body.id_budidaya);
  const tanggal_pengamatan = normalizeISODate(req.body.tanggal_pengamatan);
  const fase = String(req.body.fase || '').trim();
  const { detail_fase, catatan } = req.body;

  if (!id_budidaya || !tanggal_pengamatan || !fase) {
    return res.status(400).json({ success: false, message: 'id_budidaya, tanggal_pengamatan, dan fase wajib diisi' });
  }
  if (!ALLOWED_PHASES.has(fase)) {
    return res.status(400).json({ success: false, message: 'Fase pertumbuhan tidak valid' });
  }
  if (req.user.role === 'petugas') {
    const today = getTodayISO();
    const originalDate = normalizeISODate(existing.tanggal_pengamatan);
    if (originalDate !== today) {
      return res.status(403).json({ success: false, message: 'Data hari sebelumnya sudah terkunci. Hanya admin yang dapat mengeditnya' });
    }
    if (tanggal_pengamatan !== today) {
      return res.status(403).json({ success: false, message: 'Tanggal pengamatan petugas harus tetap hari ini' });
    }
  }

  const bud = await budidayaModel.getById(id_budidaya);
  if (!bud) return res.status(400).json({ success: false, message: 'Budidaya tidak valid' });

  const id_petugas = req.user.role === 'petugas'
    ? Number(req.user.id_user)
    : Number(req.body.id_petugas || existing.id_petugas);
  if (req.user.role === 'petugas') {
    if (Number(existing.id_petugas) !== id_petugas) {
      return res.status(403).json({ success: false, message: 'Anda tidak berwenang mengubah pengamatan ini' });
    }
    if (Number(bud.id_petugas) !== id_petugas) {
      return res.status(403).json({ success: false, message: 'Budidaya ini bukan tanggung jawab Anda' });
    }
  }

  await pertumbuhanModel.update(id, {
    id_budidaya,
    id_petugas,
    tanggal_pengamatan,
    fase,
    detail_fase,
    catatan,
    foto: req.file?.filename || existing.foto || null,
  });

  res.json({ success: true, message: 'Pertumbuhan berhasil diupdate' });
};

exports.remove = async (req, res) => {
  const affected = await pertumbuhanModel.remove(Number(req.params.id));
  if (!affected) return res.status(404).json({ success: false, message: 'Data pertumbuhan tidak ditemukan' });
  res.json({ success: true, message: 'Pertumbuhan berhasil dihapus' });
};
