const budidayaModel = require('../models/budidayaModel');
const lokasiModel = require('../models/lokasiModel');
const jenisJamurModel = require('../models/jenisJamurModel');
const mediaTanamModel = require('../models/mediaTanamModel');
const usersModel = require('../models/usersModel');
const { db } = require('../config/db');
const { normalizeISODate } = require('../utils/date');

const ALLOWED_STATUSES = new Set(['aktif', 'selesai']);

async function existsPetugas(id_petugas) {
  const [rows] = await db.query('SELECT id_user FROM petugas WHERE id_user = ? LIMIT 1', [id_petugas]);
  return rows.length > 0;
}

function validateJumlahRak(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 && number <= 10000 ? number : null;
}

function validateDailyTarget(value, max, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 2 || number > max) {
    return { error: `${label} harus bilangan bulat antara 2 dan ${max}` };
  }
  return { value: number };
}

function validateAlasan(value) {
  const alasan = String(value || '').trim();
  if (alasan.length < 3 || alasan.length > 100) {
    return { error: 'Alasan selesai wajib diisi 3-100 karakter' };
  }
  if (alasan.toLowerCase() === 'lainnya') {
    return { error: 'Jelaskan alasan selesai, jangan hanya memilih "Lainnya"' };
  }
  return { alasan };
}

exports.getAll = async (_req, res) => {
  const data = await budidayaModel.getAll();
  res.json({ success: true, data });
};

exports.getById = async (req, res) => {
  const item = await budidayaModel.getById(Number(req.params.id));
  if (!item) return res.status(404).json({ success: false, message: 'Budidaya tidak ditemukan' });
  res.json({ success: true, data: item });
};

exports.getBackupData = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const item = await budidayaModel.getById(id);
    if (!item) return res.status(404).json({ success: false, message: 'Budidaya tidak ditemukan' });

    const [panen] = await db.query('SELECT * FROM panen WHERE id_budidaya = ?', [id]);
    const [lingkungan] = await db.query('SELECT * FROM lingkungan_harian WHERE id_budidaya = ? ORDER BY tanggal_pengukuran ASC', [id]);
    const [pertumbuhan] = await db.query('SELECT * FROM pertumbuhan WHERE id_budidaya = ? ORDER BY tanggal_pengamatan ASC', [id]);
    
    item.panen = panen;
    item.lingkungan = lingkungan;
    item.pertumbuhan = pertumbuhan;

    res.json({ success: true, data: item });
  } catch (error) {
    console.error("Error getting budidaya backup data:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data backup budidaya" });
  }
};

exports.create = async (req, res) => {
  let { id_lokasi, id_jenis, id_media, status, id_petugas } = req.body;
  const tanggal_mulai = normalizeISODate(req.body.tanggal_mulai);
  const jumlah_rak = validateJumlahRak(req.body.jumlah_rak ?? 1);
  const targetLingkungan = validateDailyTarget(req.body.target_lingkungan_harian ?? 2, 3, 'Target lingkungan harian');
  const targetPertumbuhan = validateDailyTarget(req.body.target_pertumbuhan_harian ?? 2, 10, 'Target pertumbuhan harian');
  const role = await usersModel.getRole(req.user.id_user);

  if (role === 'petugas') {
    id_petugas = Number(req.user.id_user);
    const lokasiInfo = await usersModel.getPetugasLokasiInfo(id_petugas);
    if (!lokasiInfo?.id_lokasi) {
      return res.status(400).json({ success: false, message: 'Anda belum ditugaskan ke lokasi manapun' });
    }
    id_lokasi = lokasiInfo.id_lokasi;
  }

  id_lokasi = Number(id_lokasi);
  id_jenis = Number(id_jenis);
  id_media = Number(id_media);
  id_petugas = Number(id_petugas);
  status = status || 'aktif';

  if (!id_lokasi || !id_jenis || !id_media || !tanggal_mulai || !id_petugas) {
    return res.status(400).json({ success: false, message: 'Lokasi, jenis jamur, media, tanggal mulai, dan petugas wajib diisi' });
  }
  if (!jumlah_rak) {
    return res.status(400).json({ success: false, message: 'Jumlah rak harus berupa bilangan bulat lebih dari 0' });
  }
  if (targetLingkungan.error) return res.status(400).json({ success: false, message: targetLingkungan.error });
  if (targetPertumbuhan.error) return res.status(400).json({ success: false, message: targetPertumbuhan.error });
  if (!ALLOWED_STATUSES.has(status) || status === 'selesai') {
    return res.status(400).json({ success: false, message: 'Status awal harus aktif' });
  }

  const targetLokasi = await lokasiModel.getLokasiById(id_lokasi);
  if (!targetLokasi) return res.status(400).json({ success: false, message: 'Lokasi tidak valid' });
  if (!(await jenisJamurModel.exists(id_jenis))) return res.status(400).json({ success: false, message: 'Jenis jamur tidak valid' });
  if (!(await mediaTanamModel.exists(id_media))) return res.status(400).json({ success: false, message: 'Media tanam tidak valid' });
  if (!(await existsPetugas(id_petugas))) return res.status(400).json({ success: false, message: 'Petugas tidak valid' });

  const activeRacks = await budidayaModel.getActiveRacksByLokasi(id_lokasi);
  const availableRacks = Number(targetLokasi.jumlah_rak) - activeRacks;
  if (jumlah_rak > availableRacks) {
    return res.status(400).json({ success: false, message: `Kapasitas rak tidak mencukupi. Sisa rak tersedia: ${Math.max(0, availableRacks)}` });
  }

  const newId = await budidayaModel.create({
    id_lokasi,
    id_jenis,
    id_media,
    id_petugas,
    tanggal_mulai,
    status,
    jumlah_rak,
    target_lingkungan_harian: targetLingkungan.value,
    target_pertumbuhan_harian: targetPertumbuhan.value,
  });

  res.status(201).json({ success: true, message: 'Budidaya berhasil dibuat', data: { id_budidaya: newId } });
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  const existing = await budidayaModel.getById(id);
  if (!existing) return res.status(404).json({ success: false, message: 'Budidaya tidak ditemukan' });

  const id_lokasi = Number(req.body.id_lokasi);
  const id_jenis = Number(req.body.id_jenis);
  const id_media = Number(req.body.id_media);
  const id_petugas = Number(req.body.id_petugas);
  const tanggal_mulai = normalizeISODate(req.body.tanggal_mulai);
  const status = String(req.body.status || 'aktif');
  const jumlah_rak = validateJumlahRak(req.body.jumlah_rak ?? 1);
  const targetLingkungan = validateDailyTarget(req.body.target_lingkungan_harian ?? existing.target_lingkungan_harian ?? 2, 3, 'Target lingkungan harian');
  const targetPertumbuhan = validateDailyTarget(req.body.target_pertumbuhan_harian ?? existing.target_pertumbuhan_harian ?? 2, 10, 'Target pertumbuhan harian');

  if (!id_lokasi || !id_jenis || !id_media || !id_petugas || !tanggal_mulai) {
    return res.status(400).json({ success: false, message: 'Lokasi, jenis jamur, media, petugas, dan tanggal mulai wajib diisi' });
  }
  if (!jumlah_rak) return res.status(400).json({ success: false, message: 'Jumlah rak harus berupa bilangan bulat lebih dari 0' });
  if (targetLingkungan.error) return res.status(400).json({ success: false, message: targetLingkungan.error });
  if (targetPertumbuhan.error) return res.status(400).json({ success: false, message: targetPertumbuhan.error });
  if (!ALLOWED_STATUSES.has(status)) return res.status(400).json({ success: false, message: 'Status budidaya tidak valid' });
  if (existing.status === 'selesai' && status !== 'selesai') {
    return res.status(409).json({ success: false, message: 'Siklus yang sudah selesai tidak dapat diaktifkan kembali' });
  }

  let alasan_selesai = null;
  if (status === 'selesai') {
    const validation = validateAlasan(req.body.alasan_selesai);
    if (validation.error) return res.status(400).json({ success: false, message: validation.error });
    alasan_selesai = validation.alasan;
  }

  const targetLokasi = await lokasiModel.getLokasiById(id_lokasi);
  if (!targetLokasi) return res.status(400).json({ success: false, message: 'Lokasi tidak valid' });
  if (!(await jenisJamurModel.exists(id_jenis))) return res.status(400).json({ success: false, message: 'Jenis jamur tidak valid' });
  if (!(await mediaTanamModel.exists(id_media))) return res.status(400).json({ success: false, message: 'Media tanam tidak valid' });
  if (!(await existsPetugas(id_petugas))) return res.status(400).json({ success: false, message: 'Petugas tidak valid' });

  if (status === 'aktif') {
    const activeRacks = await budidayaModel.getActiveRacksByLokasi(id_lokasi, id);
    const availableRacks = Number(targetLokasi.jumlah_rak) - activeRacks;
    if (jumlah_rak > availableRacks) {
      return res.status(400).json({ success: false, message: `Kapasitas rak tidak mencukupi. Sisa rak tersedia: ${Math.max(0, availableRacks)}` });
    }
  }

  await budidayaModel.update(id, {
    id_lokasi,
    id_jenis,
    id_media,
    id_petugas,
    tanggal_mulai,
    status,
    jumlah_rak,
    target_lingkungan_harian: targetLingkungan.value,
    target_pertumbuhan_harian: targetPertumbuhan.value,
    alasan_selesai,
  });

  res.json({ success: true, message: 'Budidaya berhasil diupdate' });
};

exports.updateDailyTargets = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: 'ID budidaya tidak valid' });
  }
  const existing = await budidayaModel.getById(id);
  if (!existing) return res.status(404).json({ success: false, message: 'Budidaya tidak ditemukan' });

  const targetLingkungan = validateDailyTarget(req.body.target_lingkungan_harian, 3, 'Target lingkungan harian');
  const targetPertumbuhan = validateDailyTarget(req.body.target_pertumbuhan_harian, 10, 'Target pertumbuhan harian');
  if (targetLingkungan.error) return res.status(400).json({ success: false, message: targetLingkungan.error });
  if (targetPertumbuhan.error) return res.status(400).json({ success: false, message: targetPertumbuhan.error });

  await budidayaModel.updateDailyTargets(id, targetLingkungan.value, targetPertumbuhan.value);
  const data = await budidayaModel.getById(id);
  return res.json({ success: true, message: 'Target input harian berhasil diperbarui', data });
};

exports.selesaikan = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: 'ID budidaya tidak valid' });

  const existing = await budidayaModel.getById(id);
  if (!existing) return res.status(404).json({ success: false, message: 'Budidaya tidak ditemukan' });
  if (existing.status === 'selesai') {
    return res.status(409).json({ success: false, message: 'Siklus budidaya ini sudah selesai' });
  }
  if (req.user.role === 'petugas' && Number(existing.id_petugas) !== Number(req.user.id_user)) {
    return res.status(403).json({ success: false, message: 'Anda hanya dapat menyelesaikan budidaya yang ditugaskan kepada Anda' });
  }

  const validation = validateAlasan(req.body.alasan_selesai);
  if (validation.error) return res.status(400).json({ success: false, message: validation.error });

  const affected = await budidayaModel.selesaikan(id, validation.alasan);
  if (!affected) {
    return res.status(409).json({ success: false, message: 'Siklus gagal diselesaikan karena statusnya sudah berubah. Muat ulang data dan coba lagi' });
  }
  const data = await budidayaModel.getById(id);
  res.json({ success: true, message: 'Siklus budidaya berhasil diselesaikan', data });
};

exports.remove = async (req, res) => {
  const affected = await budidayaModel.remove(Number(req.params.id));
  if (!affected) return res.status(404).json({ success: false, message: 'Budidaya tidak ditemukan' });
  res.json({ success: true, message: 'Budidaya berhasil dihapus' });
};

exports.getByPetugas = async (req, res) => {
  const allowedStatuses = ['aktif', 'selesai'];
  const requestedStatuses = String(req.query.status || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const invalidStatus = requestedStatuses.find((value) => !allowedStatuses.includes(value));
  if (invalidStatus) return res.status(400).json({ success: false, message: `Status filter tidak valid: ${invalidStatus}` });

  const id_jenis = req.query.id_jenis ? Number(req.query.id_jenis) : null;
  const id_lokasi = req.query.id_lokasi ? Number(req.query.id_lokasi) : null;
  if (req.query.id_jenis && !id_jenis) return res.status(400).json({ success: false, message: 'Filter jenis jamur tidak valid' });
  if (req.query.id_lokasi && !id_lokasi) return res.status(400).json({ success: false, message: 'Filter lokasi tidak valid' });

  const data = await budidayaModel.getByPetugas(Number(req.user.id_user), {
    id_jenis,
    id_lokasi,
    statuses: requestedStatuses,
    q: String(req.query.q || '').trim().slice(0, 100),
  });
  res.json({ success: true, data });
};

exports.getSummary = async (_req, res) => {
  const data = await budidayaModel.getSummary();
  res.json({ success: true, data });
};
