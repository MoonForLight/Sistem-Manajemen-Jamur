require('dotenv').config();
const { db } = require('../src/config/db');

async function addColumnIfMissing(column, definition) {
  const [rows] = await db.query("SHOW COLUMNS FROM budidaya LIKE ?", [column]);
  if (rows.length === 0) {
    await db.query(`ALTER TABLE budidaya ADD COLUMN \`${column}\` ${definition}`);
    console.log(`Kolom budidaya.${column} berhasil ditambahkan`);
  } else {
    console.log(`Kolom budidaya.${column} sudah tersedia`);
  }
}

(async () => {
  try {
    await addColumnIfMissing('target_lingkungan_harian', 'TINYINT UNSIGNED NOT NULL DEFAULT 2 AFTER jumlah_rak');
    await addColumnIfMissing('target_pertumbuhan_harian', 'TINYINT UNSIGNED NOT NULL DEFAULT 2 AFTER target_lingkungan_harian');
    console.log('Migrasi target input harian selesai');
  } catch (error) {
    console.error('Migrasi target input harian gagal:', error.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
})();
