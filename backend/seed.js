require('dotenv').config();
const { db } = require('./src/config/db');

async function run() {
  try {
    const [lokasi] = await db.query("SELECT * FROM lokasi WHERE nama_lokasi LIKE '%Sembalun%'");
    if (!lokasi.length) {
      console.log('Lokasi Sembalun not found');
      return;
    }
    const id_lokasi = lokasi[0].id_lokasi;
    
    const [users] = await db.query("SELECT * FROM petugas LIMIT 1");
    if (!users.length) {
      console.log('Not enough users');
      return;
    }
    const id_petugas = users[0].id_user;

    const [jenisList] = await db.query("SELECT * FROM jenis_jamur LIMIT 2");
    const id_jenis_1 = jenisList[0]?.id_jenis || 1;
    const id_jenis_2 = jenisList[1]?.id_jenis || 1;

    const [mediaList] = await db.query("SELECT * FROM media_tanam LIMIT 1");
    const id_media = mediaList[0]?.id_media || 1;

    console.log('Found Lokasi:', id_lokasi, 'Petugas:', id_petugas);

    // Create Cycle 1
    const tglMulai1 = '2026-01-01';
    const tglSelesai1 = '2026-03-31';
    
    const [bud1] = await db.query(`
      INSERT INTO budidaya (id_lokasi, id_jenis, id_media, id_petugas, tanggal_mulai, tanggal_selesai, status, jumlah_rak, target_lingkungan_harian, target_pertumbuhan_harian, alasan_selesai)
      VALUES (?, ?, ?, ?, ?, ?, 'selesai', 4, 2, 2, 'Panen Selesai - Hasil Optimal')
    `, [id_lokasi, id_jenis_1, id_media, id_petugas, tglMulai1, tglSelesai1]);
    const idBudidaya1 = bud1.insertId;

    // Create Cycle 2
    const tglMulai2 = '2026-02-15';
    const tglSelesai2 = '2026-05-15';

    const [bud2] = await db.query(`
      INSERT INTO budidaya (id_lokasi, id_jenis, id_media, id_petugas, tanggal_mulai, tanggal_selesai, status, jumlah_rak, target_lingkungan_harian, target_pertumbuhan_harian, alasan_selesai)
      VALUES (?, ?, ?, ?, ?, ?, 'selesai', 4, 2, 2, 'Siklus Habis - Persiapan Sterilisasi')
    `, [id_lokasi, id_jenis_2, id_media, id_petugas, tglMulai2, tglSelesai2]);
    const idBudidaya2 = bud2.insertId;

    // Generate daily env data
    const generateEnv = async (idBud, start, end) => {
      const s = new Date(start);
      const e = new Date(end);
      for (let d = s; d <= e; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const times = ['Pagi', 'Siang', 'Malam'];
        for (const waktu of times) {
          const suhu = (20 + Math.random() * 8).toFixed(1); // 20 - 28
          const kelembaban = (75 + Math.random() * 15).toFixed(1); // 75 - 90
          const cahaya = Math.floor(100 + Math.random() * 300); // 100 - 400
          
          await db.query(`
            INSERT INTO lingkungan_harian (id_budidaya, id_petugas, tanggal_pengukuran, suhu, kelembaban, intensitas_cahaya, waktu_pengukuran)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [idBud, id_petugas, dateStr, suhu, kelembaban, cahaya, waktu]);
        }

        // Harvest every 4 days after day 40
        const diffDays = Math.floor((d - new Date(start)) / (1000 * 60 * 60 * 24));
        if (diffDays >= 40 && diffDays % 4 === 0) {
           const panen = (1 + Math.random() * 3).toFixed(2); // 1.00 - 4.00 kg
           await db.query(`
            INSERT INTO panen (id_budidaya, id_petugas, tanggal_panen, jumlah_panen, catatan)
            VALUES (?, ?, ?, ?, 'Panen berjalan lancar')
           `, [idBud, id_petugas, dateStr, panen]);
        }

        // Pertumbuhan log every 5 days
        if (diffDays % 5 === 0) {
           let desc = "Inkubasi";
           if (diffDays >= 30) desc = "Pertumbuhan";
           if (diffDays >= 40) desc = "Panen";
           
           await db.query(`
            INSERT INTO pertumbuhan (id_budidaya, id_petugas, tanggal_pengamatan, fase, catatan)
            VALUES (?, ?, ?, ?, 'Perkembangan sesuai target')
           `, [idBud, id_petugas, dateStr, desc]);
        }
      }
    };

    await generateEnv(idBudidaya1, tglMulai1, tglSelesai1);
    console.log('Finished cycle 1');
    await generateEnv(idBudidaya2, tglMulai2, tglSelesai2);
    console.log('Finished cycle 2');

    console.log('Seed completed successfully!');

  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
run();
