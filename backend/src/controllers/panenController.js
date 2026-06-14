const panenModel = require('../models/panenModel');
const budidayaModel = require('../models/budidayaModel');
const { db } = require('../config/db');
const { getTodayISO, normalizeISODate } = require('../utils/date');

async function existsPetugas(id_petugas) {
  const [rows] = await db.query('SELECT id_user FROM petugas WHERE id_user = ? LIMIT 1', [id_petugas]);
  return rows.length > 0;
}

exports.getAll = async (_req, res) => {
  const data = await panenModel.getAll();
  res.json({ success: true, data });
};

exports.getById = async (req, res) => {
  const item = await panenModel.getById(Number(req.params.id));
  if (!item) return res.status(404).json({ success: false, message: 'Data panen tidak ditemukan' });
  res.json({ success: true, data: item });
};

exports.getByBudidaya = async (req, res) => {
  const data = await panenModel.getByBudidaya(Number(req.params.id_budidaya));
  res.json({ success: true, data });
};

exports.create = async (req, res) => {
  const id_budidaya = Number(req.body.id_budidaya);
  const tanggal_panen = normalizeISODate(req.body.tanggal_panen);
  const jumlahNum = Number(req.body.jumlah_panen);
  const catatan = req.body.catatan;

  if (!id_budidaya || !tanggal_panen || req.body.jumlah_panen === undefined || req.body.jumlah_panen === '') {
    return res.status(400).json({ success: false, message: 'id_budidaya, tanggal_panen, dan jumlah_panen wajib diisi' });
  }
  if (!Number.isFinite(jumlahNum) || jumlahNum <= 0 || jumlahNum > 100000) {
    return res.status(400).json({ success: false, message: 'Jumlah panen harus berupa angka valid (0 < jumlah <= 100000)' });
  }
  if (req.user.role === 'petugas' && tanggal_panen !== getTodayISO()) {
    return res.status(403).json({ success: false, message: 'Petugas hanya dapat mencatat panen untuk hari ini' });
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
    return res.status(403).json({ success: false, message: 'Anda tidak berwenang mencatat panen di budidaya ini' });
  }

  const newId = await panenModel.create({
    id_budidaya,
    id_petugas,
    tanggal_panen,
    jumlah_panen: jumlahNum,
    catatan,
    foto: req.file?.filename || null,
  });

  res.status(201).json({
    success: true,
    message: 'Panen berhasil dicatat',
    data: { id_panen: newId, foto: req.file?.filename || null },
  });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const existing = await panenModel.getById(id);
  if (!existing) return res.status(404).json({ success: false, message: 'Data panen tidak ditemukan' });

  const id_budidaya = Number(req.body.id_budidaya);
  const tanggal_panen = normalizeISODate(req.body.tanggal_panen);
  const jumlahNum = Number(req.body.jumlah_panen);
  const catatan = req.body.catatan;

  if (!id_budidaya || !tanggal_panen || req.body.jumlah_panen === undefined || req.body.jumlah_panen === '') {
    return res.status(400).json({ success: false, message: 'id_budidaya, tanggal_panen, dan jumlah_panen wajib diisi' });
  }
  if (!Number.isFinite(jumlahNum) || jumlahNum <= 0 || jumlahNum > 100000) {
    return res.status(400).json({ success: false, message: 'Jumlah panen harus berupa angka valid (0 < jumlah <= 100000)' });
  }
  if (req.user.role === 'petugas') {
    const today = getTodayISO();
    const originalDate = normalizeISODate(existing.tanggal_panen);
    if (originalDate !== today) {
      return res.status(403).json({ success: false, message: 'Data panen hari sebelumnya sudah terkunci. Hanya admin yang dapat mengeditnya' });
    }
    if (tanggal_panen !== today) {
      return res.status(403).json({ success: false, message: 'Tanggal panen petugas harus tetap hari ini' });
    }
  }

  const bud = await budidayaModel.getById(id_budidaya);
  if (!bud) return res.status(400).json({ success: false, message: 'Budidaya tidak valid' });

  const id_petugas = req.user.role === 'petugas'
    ? Number(req.user.id_user)
    : Number(req.body.id_petugas || existing.id_petugas);
  if (req.user.role === 'petugas') {
    if (Number(existing.id_petugas) !== id_petugas) {
      return res.status(403).json({ success: false, message: 'Anda tidak berwenang mengubah panen ini' });
    }
    if (Number(bud.id_petugas) !== id_petugas) {
      return res.status(403).json({ success: false, message: 'Budidaya ini bukan tanggung jawab Anda' });
    }
  }

  await panenModel.update(id, {
    id_budidaya,
    id_petugas,
    tanggal_panen,
    jumlah_panen: jumlahNum,
    catatan,
    foto: req.file?.filename || existing.foto || null,
  });

  res.json({ success: true, message: 'Panen berhasil diupdate' });
};

exports.remove = async (req, res) => {
  const affected = await panenModel.remove(Number(req.params.id));
  if (!affected) return res.status(404).json({ success: false, message: 'Data panen tidak ditemukan' });
  res.json({ success: true, message: 'Panen berhasil dihapus' });
};
