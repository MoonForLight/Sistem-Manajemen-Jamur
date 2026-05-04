const { db } = require('./src/config/db');

async function migrate() {
  try {
    console.log('Creating lingkungan_harian table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS lingkungan_harian (
        id_lingkungan int(11) NOT NULL AUTO_INCREMENT,
        id_budidaya int(11) NOT NULL,
        id_petugas int(11) NOT NULL,
        tanggal_pengukuran date NOT NULL,
        suhu decimal(5,2) DEFAULT NULL,
        kelembaban decimal(5,2) DEFAULT NULL,
        intensitas_cahaya decimal(5,2) DEFAULT NULL,
        PRIMARY KEY (id_lingkungan),
        KEY fk_lingkungan_budidaya_idx (id_budidaya),
        KEY fk_lingkungan_petugas_idx (id_petugas),
        CONSTRAINT fk_lingkungan_budidaya FOREIGN KEY (id_budidaya) REFERENCES budidaya (id_budidaya) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_lingkungan_petugas FOREIGN KEY (id_petugas) REFERENCES users (id_user) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `);

    console.log('Migrating existing data...');
    await db.query(`
      INSERT INTO lingkungan_harian (id_budidaya, id_petugas, tanggal_pengukuran, suhu, kelembaban, intensitas_cahaya)
      SELECT id_budidaya, id_petugas, tanggal_pengamatan, suhu, kelembaban, intensitas_cahaya
      FROM pertumbuhan
      WHERE (suhu IS NOT NULL OR kelembaban IS NOT NULL OR intensitas_cahaya IS NOT NULL)
      AND NOT EXISTS (
         SELECT 1 FROM lingkungan_harian lh 
         WHERE lh.id_budidaya = pertumbuhan.id_budidaya 
         AND lh.tanggal_pengukuran = pertumbuhan.tanggal_pengamatan
      );
    `);

    console.log('Checking columns to drop...');
    const [cols] = await db.query("SHOW COLUMNS FROM pertumbuhan LIKE 'suhu'");
    if (cols.length > 0) {
      console.log('Altering pertumbuhan table...');
      await db.query(`
        ALTER TABLE pertumbuhan 
        DROP COLUMN suhu, 
        DROP COLUMN kelembaban, 
        DROP COLUMN intensitas_cahaya;
      `);
    }

    const [colsDetail] = await db.query("SHOW COLUMNS FROM pertumbuhan LIKE 'detail_fase'");
    if (colsDetail.length === 0) {
      await db.query("ALTER TABLE pertumbuhan ADD COLUMN detail_fase TEXT DEFAULT NULL;");
    }

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit();
  }
}
migrate();
