require('dotenv').config();
const { db } = require('../src/config/db');

async function addColumnIfMissing(table, column, definition) {
  const [rows] = await db.query(`SHOW COLUMNS FROM \`${table}\` LIKE ?`, [column]);
  if (rows.length === 0) {
    await db.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
    console.log(`Kolom ${table}.${column} berhasil ditambahkan`);
  } else {
    console.log(`Kolom ${table}.${column} sudah tersedia`);
  }
}

(async () => {
  try {
    await addColumnIfMissing('lingkungan_harian', 'foto', 'VARCHAR(255) DEFAULT NULL');
    await addColumnIfMissing('panen', 'foto', 'VARCHAR(255) DEFAULT NULL');
    console.log('Migrasi kolom foto selesai');
  } catch (error) {
    console.error('Migrasi kolom foto gagal:', error.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
})();
