const lokasiModel = require("../models/lokasiModel");
const budidayaModel = require("../models/budidayaModel");
const pertumbuhanModel = require("../models/pertumbuhanModel");
const panenModel = require("../models/panenModel");
const lingkunganModel = require("../models/lingkunganModel");
const { db } = require("../config/db");

exports.logDownload = async (req, res) => {
  const nama = String(req.body.nama || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const instansi = String(req.body.instansi || '').trim();
  const tujuan = String(req.body.tujuan || '').trim();
  const tipe_laporan = String(req.body.tipe_laporan || '').trim();
  const bulan = req.body.bulan ? String(req.body.bulan).trim() : null;
  const id_budidaya = req.body.id_budidaya ? Number(req.body.id_budidaya) : null;

  if (!nama || !email || !instansi || !tujuan || !tipe_laporan) {
    return res.status(400).json({ success: false, message: 'Nama, email, instansi, tujuan, dan tipe laporan wajib diisi' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Format email tidak valid' });
  }
  if (bulan && !/^\d{4}-\d{2}$/.test(bulan)) {
    return res.status(400).json({ success: false, message: 'Format bulan harus YYYY-MM' });
  }
  if (req.body.id_budidaya && (!Number.isInteger(id_budidaya) || id_budidaya <= 0)) {
    return res.status(400).json({ success: false, message: 'ID budidaya tidak valid' });
  }

  try {
    await db.query(
      `INSERT INTO download_logs
        (nama, email, instansi, tujuan, tipe_laporan, bulan, id_budidaya)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nama.slice(0, 150), email.slice(0, 150), instansi.slice(0, 150), tujuan, tipe_laporan.slice(0, 100), bulan, id_budidaya]
    );
    res.json({ success: true, message: 'Log download berhasil dicatat' });
  } catch (error) {
    console.error('Gagal mencatat log download:', error);
    res.status(500).json({ success: false, message: 'Gagal mencatat log download' });
  }
};

exports.getDownloadRekapTop = async (req, res) => {
  try {
    const requestedLimit = Number(req.query.limit) || 10;
    const limit = Math.min(50, Math.max(1, Math.trunc(requestedLimit)));

    const [[summary]] = await db.query(
      `SELECT COUNT(*) AS total_download,
              COUNT(DISTINCT email) AS pengunduh_unik,
              COUNT(DISTINCT instansi) AS instansi_unik,
              SUM(CASE WHEN DATE_FORMAT(tanggal_download, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m') THEN 1 ELSE 0 END) AS download_bulan_ini
       FROM download_logs`
    );

    // 1) Top tipe_laporan
    const [topTipe] = await db.query(
      `SELECT tipe_laporan, COUNT(*) AS total
       FROM download_logs
       GROUP BY tipe_laporan
       ORDER BY total DESC
       LIMIT ?`,
      [limit]
    );

    // 2) Top id_budidaya (opsional, hanya jika ada)
    const [topBudidaya] = await db.query(
      `SELECT id_budidaya, COUNT(*) AS total
       FROM download_logs
       WHERE id_budidaya IS NOT NULL
       GROUP BY id_budidaya
       ORDER BY total DESC
       LIMIT ?`,
      [limit]
    );

    // 3) Top pengunduh berdasarkan email
    const [topPengunduh] = await db.query(
      `SELECT email, COUNT(*) AS total
       FROM download_logs
       GROUP BY email
       ORDER BY total DESC
       LIMIT ?`,
      [limit]
    );

    const [terbaru] = await db.query(
      `SELECT id_log, nama, email, instansi, tujuan, tipe_laporan, bulan, id_budidaya, tanggal_download
       FROM download_logs
       ORDER BY tanggal_download DESC, id_log DESC
       LIMIT ?`,
      [limit]
    );

    res.json({
      success: true,
      data: {
        ringkasan: {
          total_download: Number(summary?.total_download || 0),
          pengunduh_unik: Number(summary?.pengunduh_unik || 0),
          instansi_unik: Number(summary?.instansi_unik || 0),
          download_bulan_ini: Number(summary?.download_bulan_ini || 0),
        },
        top_tipe_laporan: topTipe,
        top_id_budidaya: topBudidaya,
        top_pengunduh: topPengunduh,
        terbaru,
      },
    });
  } catch (error) {
    console.error("Gagal rekap top download:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil rekap download" });
  }
};

exports.getMonitoring = async (req, res) => {
  const lokasiId = Number(req.query.id);
  if (!lokasiId) {
    return res.status(400).json({ success: false, message: "Parameter id wajib diisi" });
  }

  const lokasi = await lokasiModel.getLokasiById(lokasiId);
  if (!lokasi) {
    return res.status(404).json({ success: false, message: "Lokasi tidak ditemukan" });
  }

  const budidaya = await budidayaModel.getByLokasi(lokasiId);
  const panen = await panenModel.getByLokasi(lokasiId);
  const pertumbuhan = await pertumbuhanModel.getByLokasi(lokasiId);
  const lingkungan = await lingkunganModel.getByLokasi(lokasiId);

  const suhuRata = lingkungan.length
    ? Number(
        (
          lingkungan.reduce((acc, item) => acc + (Number(item.suhu) || 0), 0) /
          lingkungan.length
        ).toFixed(1)
      )
    : 0;

  const kelembapanRata = lingkungan.length
    ? Number(
        (
          lingkungan.reduce((acc, item) => acc + (Number(item.kelembaban) || 0), 0) /
          lingkungan.length
        ).toFixed(1)
      )
    : 0;

  const totalProduksi = panen.reduce((acc, item) => acc + (Number(item.jumlah_panen) || 0), 0);

  res.json({
    success: true,
    data: {
      lokasi,
      budidaya,
      panen,
      pertumbuhan,
      lingkungan,
      kpi: {
        suhu_rata: suhuRata,
        kelembapan: kelembapanRata,
        total_produksi: totalProduksi,
        status_lokasi: budidaya.length ? budidaya[0].status : "Belum ada data",
      },
    },
  });
};
