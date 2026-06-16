const { db } = require('./backend/src/config/db');

async function test() {
  try {
    const id = 1;
    console.log("Fetching panen...");
    const [panen] = await db.query('SELECT * FROM panen WHERE id_budidaya = ?', [id]);
    console.log("Fetching lingkungan...");
    const [lingkungan] = await db.query('SELECT * FROM lingkungan_harian WHERE id_budidaya = ? ORDER BY tanggal_pengukuran ASC', [id]);
    console.log("Fetching pertumbuhan...");
    const [pertumbuhan] = await db.query('SELECT * FROM pertumbuhan WHERE id_budidaya = ? ORDER BY tanggal_pengamatan ASC', [id]);
    console.log("Success!");
  } catch (err) {
    console.error("ERROR CAUGHT:");
    console.error(err);
  } finally {
    process.exit(0);
  }
}

test();
