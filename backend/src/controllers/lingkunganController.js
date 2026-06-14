const lingkunganModel = require('../models/lingkunganModel');
const budidayaModel = require('../models/budidayaModel');
const { db } = require('../config/db');
const { getTodayISO, normalizeISODate } = require('../utils/date');

async function existsPetugas(id_petugas) {
  const [rows] = await db.query('SELECT id_user FROM petugas WHERE id_user = ? LIMIT 1', [id_petugas]);
  return rows.length > 0;
}

function normalizeWaktu(value) {
  if (value === 'Sore') return 'Sore/Malam';
  return value;
}

function validateNumbers({ suhu, kelembaban, intensitas_cahaya }) {
  const suhuNum = Number(suhu);
  const kelembabanNum = Number(kelembaban);
  if (!Number.isFinite(suhuNum) || suhuNum <= 0 || suhuNum > 60) {
    return { error: 'Suhu harus berupa angka valid (0 < suhu <= 60)' };
  }
  if (!Number.isFinite(kelembabanNum) || kelembabanNum < 0 || kelembabanNum > 100) {
    return { error: 'Kelembaban harus berupa angka valid (0 <= kelembaban <= 100)' };
  }

  let intensitasNum = null;
  if (intensitas_cahaya !== undefined && intensitas_cahaya !== null && intensitas_cahaya !== '') {
    intensitasNum = Number(intensitas_cahaya);
    if (!Number.isFinite(intensitasNum) || intensitasNum < 0 || intensitasNum > 100000) {
      return { error: 'Intensitas cahaya harus berupa angka valid (0 <= intensitas <= 100000)' };
    }
  }
  return { suhuNum, kelembabanNum, intensitasNum };
}

exports.getAll = async (_req, res) => {
  const data = await lingkunganModel.getAll();
  res.json({ success: true, data });
};

exports.getById = async (req, res) => {
  const item = await lingkunganModel.getById(Number(req.params.id));
  if (!item) return res.status(404).json({ success: false, message: 'Data lingkungan tidak ditemukan' });
  res.json({ success: true, data: item });
};

exports.getByBudidaya = async (req, res) => {
  const data = await lingkunganModel.getByBudidaya(Number(req.params.id_budidaya));
  res.json({ success: true, data });
};

exports.create = async (req, res) => {
  const id_budidaya = Number(req.body.id_budidaya);
  const tanggal_pengukuran = normalizeISODate(req.body.tanggal_pengukuran);
  const waktu_pengukuran = normalizeWaktu(req.body.waktu_pengukuran);
  const { suhu, kelembaban, intensitas_cahaya } = req.body;

  if (!id_budidaya || !tanggal_pengukuran || !waktu_pengukuran || suhu == null || kelembaban == null) {
    return res.status(400).json({ success: false, message: 'id_budidaya, tanggal, waktu, suhu, dan kelembaban wajib diisi' });
  }
  if (!['Pagi', 'Siang', 'Sore/Malam'].includes(waktu_pengukuran)) {
    return res.status(400).json({ success: false, message: 'Waktu pengukuran tidak valid' });
  }
  if (req.user.role === 'petugas' && tanggal_pengukuran !== getTodayISO()) {
    return res.status(403).json({ success: false, message: 'Petugas hanya dapat mengisi pengukuran untuk hari ini' });
  }

  const numeric = validateNumbers({ suhu, kelembaban, intensitas_cahaya });
  if (numeric.error) return res.status(400).json({ success: false, message: numeric.error });

  const bud = await budidayaModel.getById(id_budidaya);
  if (!bud) return res.status(400).json({ success: false, message: 'Budidaya tidak valid' });

  const id_petugas = req.user.role === 'petugas'
    ? Number(req.user.id_user)
    : Number(req.body.id_petugas || bud.id_petugas);

  if (!(await existsPetugas(id_petugas))) {
    return res.status(400).json({ success: false, message: 'Petugas tidak valid' });
  }
  if (req.user.role === 'petugas' && Number(bud.id_petugas) !== id_petugas) {
    return res.status(403).json({ success: false, message: 'Anda tidak berwenang mencatat lingkungan di budidaya ini' });
  }

  const existingTimes = await lingkunganModel.getWaktuByPetugasAndTanggal(
    id_petugas,
    tanggal_pengukuran,
    id_budidaya
  );
  if (existingTimes.some((row) => normalizeWaktu(row.waktu_pengukuran) === waktu_pengukuran)) {
    return res.status(400).json({ success: false, message: 'Waktu pengukuran untuk budidaya dan tanggal ini sudah diisi' });
  }
  const newId = await lingkunganModel.create({
    id_budidaya,
    id_petugas,
    tanggal_pengukuran,
    waktu_pengukuran,
    suhu: numeric.suhuNum,
    kelembaban: numeric.kelembabanNum,
    intensitas_cahaya: numeric.intensitasNum,
    foto: req.file?.filename || null,
  });

  res.status(201).json({
    success: true,
    message: 'Kondisi lingkungan berhasil dicatat',
    data: { id_lingkungan: newId, foto: req.file?.filename || null },
  });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const existing = await lingkunganModel.getById(id);
  if (!existing) return res.status(404).json({ success: false, message: 'Data lingkungan tidak ditemukan' });

  const id_budidaya = Number(req.body.id_budidaya);
  const tanggal_pengukuran = normalizeISODate(req.body.tanggal_pengukuran);
  const waktu_pengukuran = normalizeWaktu(req.body.waktu_pengukuran);
  const { suhu, kelembaban, intensitas_cahaya } = req.body;

  if (!id_budidaya || !tanggal_pengukuran || !waktu_pengukuran || suhu == null || kelembaban == null) {
    return res.status(400).json({ success: false, message: 'id_budidaya, tanggal, waktu, suhu, dan kelembaban wajib diisi' });
  }
  if (!['Pagi', 'Siang', 'Sore/Malam'].includes(waktu_pengukuran)) {
    return res.status(400).json({ success: false, message: 'Waktu pengukuran tidak valid' });
  }
  if (req.user.role === 'petugas') {
    const today = getTodayISO();
    const originalDate = normalizeISODate(existing.tanggal_pengukuran);
    if (originalDate !== today) {
      return res.status(403).json({ success: false, message: 'Data hari sebelumnya sudah terkunci. Hanya admin yang dapat mengeditnya' });
    }
    if (tanggal_pengukuran !== today) {
      return res.status(403).json({ success: false, message: 'Tanggal pengukuran petugas harus tetap hari ini' });
    }
  }

  const numeric = validateNumbers({ suhu, kelembaban, intensitas_cahaya });
  if (numeric.error) return res.status(400).json({ success: false, message: numeric.error });

  const bud = await budidayaModel.getById(id_budidaya);
  if (!bud) return res.status(400).json({ success: false, message: 'Budidaya tidak valid' });

  const id_petugas = req.user.role === 'petugas'
    ? Number(req.user.id_user)
    : Number(req.body.id_petugas || existing.id_petugas);

  if (req.user.role === 'petugas') {
    if (Number(existing.id_petugas) !== id_petugas) {
      return res.status(403).json({ success: false, message: 'Anda tidak berwenang mengubah data lingkungan ini' });
    }
    if (Number(bud.id_petugas) !== id_petugas) {
      return res.status(403).json({ success: false, message: 'Budidaya ini bukan tanggung jawab Anda' });
    }
  }

  const duplicateTimes = await lingkunganModel.getWaktuByPetugasAndTanggal(
    id_petugas,
    tanggal_pengukuran,
    id_budidaya,
    id
  );
  if (duplicateTimes.some((row) => normalizeWaktu(row.waktu_pengukuran) === waktu_pengukuran)) {
    return res.status(400).json({ success: false, message: 'Waktu pengukuran untuk budidaya dan tanggal ini sudah diisi' });
  }

  const affected = await lingkunganModel.update(id, {
    id_budidaya,
    id_petugas,
    tanggal_pengukuran,
    waktu_pengukuran,
    suhu: numeric.suhuNum,
    kelembaban: numeric.kelembabanNum,
    intensitas_cahaya: numeric.intensitasNum,
    foto: req.file?.filename || existing.foto || null,
  });

  res.json({ success: true, message: 'Data lingkungan berhasil diupdate', data: { affected } });
};

exports.remove = async (req, res) => {
  const affected = await lingkunganModel.remove(Number(req.params.id));
  if (!affected) return res.status(404).json({ success: false, message: 'Data lingkungan tidak ditemukan' });
  res.json({ success: true, message: 'Data lingkungan berhasil dihapus' });
};
