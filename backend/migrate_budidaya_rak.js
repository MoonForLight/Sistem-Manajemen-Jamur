const mysql = require('mysql2/promise');

(async () => {
  const db = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'manajemen_jamur' });
  try {
    // Add jumlah_rak column if it doesn't exist
    const [columns] = await db.query("SHOW COLUMNS FROM budidaya LIKE 'jumlah_rak'");
    if (columns.length === 0) {
      await db.query("ALTER TABLE budidaya ADD COLUMN jumlah_rak INT NOT NULL DEFAULT 1");
      console.log("Successfully added 'jumlah_rak' to 'budidaya' table.");
    } else {
      console.log("'jumlah_rak' already exists in 'budidaya' table.");
    }
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
})();
