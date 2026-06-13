const lokasiModel = require("../models/lokasiModel");
const budidayaModel = require("../models/budidayaModel");
const pertumbuhanModel = require("../models/pertumbuhanModel");
const panenModel = require("../models/panenModel");
const lingkunganModel = require("../models/lingkunganModel");
const { db } = require("../config/db");

exports.logDownload = async (req, res) => {
  const { nama, email, instansi, tujuan, tipe_laporan } = req.body;
  
  if (!nama || !email || !instansi || !tujuan) {
    return res.status(400).json({ success: false, message: "Semua data identitas wajib diisi" });
  }

  try {
    await db.query(
      `INSERT INTO download_logs (nama, email, instansi, tujuan, tipe_laporan)
       VALUES (?, ?, ?, ?, ?)`,
      [nama, email, instansi, tujuan, tipe_laporan || "Tidak diketahui"]
    );
    res.json({ success: true, message: "Log download berhasil dicatat" });
  } catch (error) {
    console.error("Gagal mencatat log download:", error);
    res.status(500).json({ success: false, message: "Gagal mencatat log download" });
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
