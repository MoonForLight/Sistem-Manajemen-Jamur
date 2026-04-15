const lokasiModel = require("../models/lokasiModel");
const budidayaModel = require("../models/budidayaModel");
const pertumbuhanModel = require("../models/pertumbuhanModel");
const panenModel = require("../models/panenModel");

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

  const suhuRata = pertumbuhan.length
    ? Number(
        (
          pertumbuhan.reduce((acc, item) => acc + (Number(item.suhu) || 0), 0) /
          pertumbuhan.length
        ).toFixed(1)
      )
    : 0;

  const kelembapanRata = pertumbuhan.length
    ? Number(
        (
          pertumbuhan.reduce((acc, item) => acc + (Number(item.kelembaban) || 0), 0) /
          pertumbuhan.length
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
      kpi: {
        suhu_rata: suhuRata,
        kelembapan: kelembapanRata,
        total_produksi: totalProduksi,
        status_lokasi: budidaya.length ? budidaya[0].status : "Belum ada data",
      },
    },
  });
};
