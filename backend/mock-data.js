require('dotenv').config();
const { db } = require('./src/config/db');

async function insertData() {
  try {
    await db.query(`
      INSERT INTO jenis_jamur (nama_jamur, genus, suhu_optimal, kelembapan_optimal) 
      VALUES 
      ('Jamur Tiram Putih', 'Pleurotus ostreatus', 26, 85),
      ('Jamur Tiram Coklat', 'Pleurotus cystidiosus', 27, 85),
      ('Jamur Merang', 'Volvariella volvacea', 32, 90),
      ('Jamur Kancing', 'Agaricus bisporus', 18, 85),
      ('Jamur Shiitake', 'Lentinula edodes', 20, 80),
      ('Jamur Kuping', 'Auricularia auricula', 28, 90)
    `);
    
    await db.query(`
      INSERT INTO media_tanam (nama_media, kadar_air_optimal, catatan) 
      VALUES 
      ('Serbuk Gergaji Kayu Albasia', 60, 'Sangat baik untuk pertumbuhan miselium jamur tiram'),
      ('Jerami Padi', 65, 'Bagus untuk jamur merang, perlu fermentasi terlebih dahulu'),
      ('Kompos Campuran', 65, 'Cocok untuk jamur kancing, butuh pasteurisasi ketat'),
      ('Serbuk Gergaji + Bekatul', 62, 'Nutrisi tinggi untuk jamur kuping dan shiitake'),
      ('Kapas Limbah Tekstil', 65, 'Alternatif untuk jamur merang dengan masa panen cepat')
    `);
    
    console.log('Mock data inserted successfully!');
    process.exit(0);
  } catch(err) {
    console.error('Error inserting mock data:', err);
    process.exit(1);
  }
}

insertData();
