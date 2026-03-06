/**
 * Mock data yang mengikuti ERD:
 * - lokasi(id_lokasi,nama_lokasi,alamat,jumlah_rak,keterangan)
 * - jenis_jamur(id_jenis,nama_jamur,genus,suhu_optimal,kelembapan_optimal)
 * - media_tanam(id_media,nama_media,kadar_air_optimal,catatan)
 * - budidaya(id_budidaya,id_user,id_lokasi,id_jenis,id_media,tanggal_mulai,status)
 * - pertumbuhan(id_pertumbuhan,id_budidaya,tanggal_pengamatan,suhu,kelembaban,intensitas_cahaya,fase,catatan)
 * - panen(id_panen,id_budidaya,id_user,tanggal_panen,jumlah_panen,catatan)
 */

export const lokasi = [
  {
    id_lokasi: 'LKS-001',
    nama_lokasi: 'Sembalun',
    alamat: 'Lombok Timur, NTB',
    jumlah_rak: 5,
    keterangan: 'Status lokasi normal'
  },
  {
    id_lokasi: 'LKS-002',
    nama_lokasi: 'Narmada',
    alamat: 'Lombok Barat, NTB',
    jumlah_rak: 3,
    keterangan: 'Kelembapan cenderung tinggi'
  },
  {
    id_lokasi: 'LKS-003',
    nama_lokasi: 'Mataram',
    alamat: 'Kota Mataram, NTB',
    jumlah_rak: 4,
    keterangan: 'Perlu monitoring ventilasi'
  }
]

export const jenisJamur = [
  {
    id_jenis: 'JNS-001',
    nama_jamur: 'Tiram',
    genus: 'Pleurotus',
    suhu_optimal: '24–28°C',
    kelembapan_optimal: '80–90%'
  },
  {
    id_jenis: 'JNS-002',
    nama_jamur: 'Kancing',
    genus: 'Agaricus',
    suhu_optimal: '20–24°C',
    kelembapan_optimal: '85–95%'
  },
  {
    id_jenis: 'JNS-003',
    nama_jamur: 'Portobello',
    genus: 'Agaricus',
    suhu_optimal: '18–22°C',
    kelembapan_optimal: '85–95%'
  }
]

export const mediaTanam = [
  {
    id_media: 'MED-001',
    nama_media: 'Baglog',
    kadar_air_optimal: '60–65%',
    catatan: 'Cocok untuk tiram/kancing, pastikan sterilisasi.'
  },
  {
    id_media: 'MED-002',
    nama_media: 'Kompos Dedak',
    kadar_air_optimal: '55–60%',
    catatan: 'Kontrol amonia & fermentasi agar stabil.'
  },
  {
    id_media: 'MED-003',
    nama_media: 'Kompos Jerami',
    kadar_air_optimal: '55–60%',
    catatan: 'Aduk berkala; jaga suhu saat fermentasi.'
  }
]

// Public budidaya summary per lokasi (mock)
export const budidaya = [
  {
    id_budidaya: 'BDY-101',
    id_user: 'USR-PTG-01',
    id_lokasi: 'LKS-001',
    id_jenis: 'JNS-001',
    id_media: 'MED-003',
    tanggal_mulai: '2026-02-10',
    status: 'Pertumbuhan'
  },
  {
    id_budidaya: 'BDY-102',
    id_user: 'USR-PTG-01',
    id_lokasi: 'LKS-001',
    id_jenis: 'JNS-002',
    id_media: 'MED-001',
    tanggal_mulai: '2026-02-18',
    status: 'Inkubasi'
  },
  {
    id_budidaya: 'BDY-103',
    id_user: 'USR-PTG-02',
    id_lokasi: 'LKS-002',
    id_jenis: 'JNS-001',
    id_media: 'MED-001',
    tanggal_mulai: '2026-02-05',
    status: 'Pertumbuhan'
  },
  {
    id_budidaya: 'BDY-104',
    id_user: 'USR-PTG-02',
    id_lokasi: 'LKS-003',
    id_jenis: 'JNS-003',
    id_media: 'MED-002',
    tanggal_mulai: '2026-01-26',
    status: 'Panen'
  }
]

export const pertumbuhan = [
  {
    id_pertumbuhan: 'PRT-001',
    id_budidaya: 'BDY-101',
    tanggal_pengamatan: '2026-02-28T07:30:00',
    suhu: 26,
    kelembaban: 82,
    intensitas_cahaya: 'Rendah',
    fase: 'Miselium',
    catatan: 'Miselium merata ±70%. Media normal, tidak terlalu basah.'
  },
  {
    id_pertumbuhan: 'PRT-002',
    id_budidaya: 'BDY-101',
    tanggal_pengamatan: '2026-02-27T16:10:00',
    suhu: 27,
    kelembaban: 84,
    intensitas_cahaya: 'Sedang',
    fase: 'Miselium',
    catatan: 'Ventilasi cukup. Tidak ada tanda kontaminasi.'
  },
  {
    id_pertumbuhan: 'PRT-003',
    id_budidaya: 'BDY-103',
    tanggal_pengamatan: '2026-02-28T11:40:00',
    suhu: 25,
    kelembaban: 86,
    intensitas_cahaya: 'Rendah',
    fase: 'Primordia',
    catatan: 'Pinhead mulai muncul. Semprot kabut 2x/hari.'
  }
]

export const panen = [
  {
    id_panen: 'PN-001',
    id_budidaya: 'BDY-104',
    id_user: 'USR-PTG-02',
    tanggal_panen: '2026-02-27',
    jumlah_panen: 12,
    catatan: 'Kualitas bagus, ukuran seragam.'
  },
  {
    id_panen: 'PN-002',
    id_budidaya: 'BDY-104',
    id_user: 'USR-PTG-02',
    tanggal_panen: '2026-02-20',
    jumlah_panen: 10,
    catatan: 'Flush kedua.'
  }
]

export function getLokasiWithSummary() {
  // ringkasan publik per lokasi
  return lokasi.map((l) => {
    const b = budidaya.filter((x) => x.id_lokasi === l.id_lokasi)
    const jenisSet = new Set(b.map((x) => x.id_jenis))
    const jenisNames = [...jenisSet]
      .map((id) => jenisJamur.find((j) => j.id_jenis === id)?.nama_jamur)
      .filter(Boolean)
    return {
      ...l,
      jumlah_kumbung: 1,
      jenis_jamur: jenisNames[0] ?? 'Tiram',
      total_budidaya: b.length
    }
  })
}

export function getLokasiDetail(lokasiId) {
  const loc = lokasi.find((l) => l.id_lokasi === lokasiId)
  if (!loc) return null

  const budidayaLokasi = budidaya.filter((b) => b.id_lokasi === lokasiId)
  const budidayaIds = budidayaLokasi.map((b) => b.id_budidaya)

  const pert = pertumbuhan
    .filter((p) => budidayaIds.includes(p.id_budidaya))
    .sort((a, b) => new Date(a.tanggal_pengamatan) - new Date(b.tanggal_pengamatan))

  const pan = panen
    .filter((p) => budidayaIds.includes(p.id_budidaya))
    .sort((a, b) => new Date(a.tanggal_panen) - new Date(b.tanggal_panen))

  // KPI contoh: ambil rata-rata dari pertumbuhan terakhir
  const last = pert.at(-1)
  const avgTemp = last?.suhu ?? 24
  const avgHum = last?.kelembaban ?? 82
  const totalProd = pan.reduce((s, x) => s + x.jumlah_panen, 0)

  return {
    lokasi: loc,
    budidaya: budidayaLokasi,
    pertumbuhan: pert,
    panen: pan,
    kpi: {
      suhu_rata: `${avgTemp}°C`,
      kelembapan: `${avgHum}%`,
      total_produksi: `${totalProd} kg`,
      status_lokasi: 'Normal'
    }
  }
}
