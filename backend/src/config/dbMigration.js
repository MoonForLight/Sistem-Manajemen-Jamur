const { db } = require("./db");

async function ensureSchema() {
  const schema = [
    {
      name: 'users',
      sql: `CREATE TABLE IF NOT EXISTS users (
        id_user INT(11) NOT NULL AUTO_INCREMENT,
        nama VARCHAR(100) NOT NULL,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        foto_profil VARCHAR(255) DEFAULT NULL,
        email VARCHAR(100) DEFAULT NULL,
        no_hp VARCHAR(20) DEFAULT NULL,
        PRIMARY KEY (id_user),
        UNIQUE KEY username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
    },
    {
      name: 'admin',
      sql: `CREATE TABLE IF NOT EXISTS admin (
        id_admin INT(11) NOT NULL AUTO_INCREMENT,
        id_user INT(11) NOT NULL,
        PRIMARY KEY (id_admin),
        UNIQUE KEY idx_admin_user (id_user),
        CONSTRAINT fk_admin_user FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
    },
    {
      name: 'lokasi',
      sql: `CREATE TABLE IF NOT EXISTS lokasi (
        id_lokasi INT(11) NOT NULL AUTO_INCREMENT,
        nama_lokasi VARCHAR(150) NOT NULL,
        alamat VARCHAR(255) DEFAULT NULL,
        jumlah_rak INT(11) NOT NULL DEFAULT 0,
        keterangan TEXT DEFAULT NULL,
        foto_lokasi VARCHAR(255) DEFAULT NULL,
        PRIMARY KEY (id_lokasi)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
    },
    {
      name: 'jenis_jamur',
      sql: `CREATE TABLE IF NOT EXISTS jenis_jamur (
        id_jenis INT(11) NOT NULL AUTO_INCREMENT,
        nama_jamur VARCHAR(100) NOT NULL,
        genus VARCHAR(100) DEFAULT NULL,
        suhu_optimal DECIMAL(5,2) DEFAULT NULL,
        kelembapan_optimal DECIMAL(5,2) DEFAULT NULL,
        PRIMARY KEY (id_jenis)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
    },
    {
      name: 'media_tanam',
      sql: `CREATE TABLE IF NOT EXISTS media_tanam (
        id_media INT(11) NOT NULL AUTO_INCREMENT,
        nama_media VARCHAR(150) NOT NULL,
        kadar_air_optimal DECIMAL(5,2) DEFAULT NULL,
        catatan TEXT DEFAULT NULL,
        PRIMARY KEY (id_media)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
    },
    {
      name: 'petugas',
      sql: `CREATE TABLE IF NOT EXISTS petugas (
        id_petugas INT(11) NOT NULL AUTO_INCREMENT,
        id_user INT(11) NOT NULL,
        id_lokasi INT(11) DEFAULT NULL,
        status VARCHAR(50) NOT NULL,
        PRIMARY KEY (id_petugas),
        UNIQUE KEY idx_petugas_user (id_user),
        KEY fk_petugas_lokasi_idx (id_lokasi),
        CONSTRAINT fk_petugas_user FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_petugas_lokasi FOREIGN KEY (id_lokasi) REFERENCES lokasi(id_lokasi) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
    },
    {
      name: 'budidaya',
      sql: `CREATE TABLE IF NOT EXISTS budidaya (
        id_budidaya INT(11) NOT NULL AUTO_INCREMENT,
        id_lokasi INT(11) NOT NULL,
        id_jenis INT(11) NOT NULL,
        id_media INT(11) NOT NULL,
        id_petugas INT(11) NOT NULL,
        tanggal_mulai DATE DEFAULT NULL,
        status VARCHAR(50) DEFAULT NULL,
        PRIMARY KEY (id_budidaya),
        KEY fk_budidaya_lokasi_idx (id_lokasi),
        KEY fk_budidaya_jenis_idx (id_jenis),
        KEY fk_budidaya_media_idx (id_media),
        KEY fk_budidaya_petugas_idx (id_petugas),
        CONSTRAINT fk_budidaya_lokasi FOREIGN KEY (id_lokasi) REFERENCES lokasi(id_lokasi) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_budidaya_jenis FOREIGN KEY (id_jenis) REFERENCES jenis_jamur(id_jenis) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_budidaya_media FOREIGN KEY (id_media) REFERENCES media_tanam(id_media) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_budidaya_petugas FOREIGN KEY (id_petugas) REFERENCES users(id_user) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
    },
    {
      name: 'pertumbuhan',
      sql: `CREATE TABLE IF NOT EXISTS pertumbuhan (
        id_pertumbuhan INT(11) NOT NULL AUTO_INCREMENT,
        id_budidaya INT(11) NOT NULL,
        id_petugas INT(11) NOT NULL,
        tanggal_pengamatan DATE DEFAULT NULL,
        fase VARCHAR(100) DEFAULT NULL,
        detail_fase TEXT DEFAULT NULL,
        catatan TEXT DEFAULT NULL,
        PRIMARY KEY (id_pertumbuhan),
        KEY fk_pertumbuhan_budidaya_idx (id_budidaya),
        KEY fk_pertumbuhan_petugas_idx (id_petugas),
        CONSTRAINT fk_pertumbuhan_budidaya FOREIGN KEY (id_budidaya) REFERENCES budidaya(id_budidaya) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_pertumbuhan_petugas FOREIGN KEY (id_petugas) REFERENCES users(id_user) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
    },
    {
      name: 'lingkungan_harian',
      sql: `CREATE TABLE IF NOT EXISTS lingkungan_harian (
        id_lingkungan INT(11) NOT NULL AUTO_INCREMENT,
        id_budidaya INT(11) NOT NULL,
        id_petugas INT(11) NOT NULL,
        tanggal_pengukuran DATE NOT NULL,
        suhu DECIMAL(5,2) DEFAULT NULL,
        kelembaban DECIMAL(5,2) DEFAULT NULL,
        intensitas_cahaya DECIMAL(5,2) DEFAULT NULL,
        PRIMARY KEY (id_lingkungan),
        KEY fk_lingkungan_budidaya_idx (id_budidaya),
        KEY fk_lingkungan_petugas_idx (id_petugas),
        CONSTRAINT fk_lingkungan_budidaya FOREIGN KEY (id_budidaya) REFERENCES budidaya(id_budidaya) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_lingkungan_petugas FOREIGN KEY (id_petugas) REFERENCES users(id_user) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
    },
    {
      name: 'panen',
      sql: `CREATE TABLE IF NOT EXISTS panen (
        id_panen INT(11) NOT NULL AUTO_INCREMENT,
        id_budidaya INT(11) NOT NULL,
        id_petugas INT(11) NOT NULL,
        tanggal_panen DATE DEFAULT NULL,
        jumlah_panen INT(11) DEFAULT NULL,
        catatan TEXT DEFAULT NULL,
        PRIMARY KEY (id_panen),
        KEY fk_panen_budidaya_idx (id_budidaya),
        KEY fk_panen_petugas_idx (id_petugas),
        CONSTRAINT fk_panen_budidaya FOREIGN KEY (id_budidaya) REFERENCES budidaya(id_budidaya) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_panen_petugas FOREIGN KEY (id_petugas) REFERENCES users(id_user) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
    },
  ];

  await db.query('SET FOREIGN_KEY_CHECKS = 0');

  for (const { sql } of schema) {
    try {
      await db.query(sql);
    } catch (err) {
      console.warn('Schema step failed, continuing:', err.code, err.sqlMessage);
    }
  }

  for (const { name, sql } of schema) {
    try {
      await db.query(`ALTER TABLE \`${name}\` ENGINE=InnoDB`);
    } catch (err) {
      console.warn(`Could not alter engine for ${name}:`, err.code || err.message);

      if (err.code === 'ER_TABLE_CORRUPT' || err.sqlMessage?.includes("doesn't exist in engine") || err.code === 'ER_TABLE_EXISTS_ERROR') {
        try {
          console.warn(`Repairing ${name} by dropping and recreating the table.`);
          await db.query(`DROP TABLE IF EXISTS \`${name}\``);
          await db.query(sql);
          console.log(`Table ${name} recreated successfully.`);
        } catch (repairErr) {
          console.error(`Failed to repair ${name}:`, repairErr.code || repairErr.message || repairErr);
        }
      }
    }
  }

  await migrateLegacySchema();
  await db.query('SET FOREIGN_KEY_CHECKS = 1');
}

async function migrateLegacySchema() {
  try {
    const [usersFotocol] = await db.query("SHOW COLUMNS FROM users LIKE 'foto_profil'");
    if (usersFotocol.length === 0) {
      await db.query("ALTER TABLE users ADD COLUMN foto_profil VARCHAR(255) DEFAULT NULL");
    }

    const [usersEmailCol] = await db.query("SHOW COLUMNS FROM users LIKE 'email'");
    if (usersEmailCol.length === 0) {
      await db.query("ALTER TABLE users ADD COLUMN email VARCHAR(100) DEFAULT NULL");
    }

    const [usersPhoneCol] = await db.query("SHOW COLUMNS FROM users LIKE 'no_hp'");
    if (usersPhoneCol.length === 0) {
      await db.query("ALTER TABLE users ADD COLUMN no_hp VARCHAR(20) DEFAULT NULL");
    }

    const [lokasiPhotoCol] = await db.query("SHOW COLUMNS FROM lokasi LIKE 'foto_lokasi'");
    if (lokasiPhotoCol.length === 0) {
      await db.query("ALTER TABLE lokasi ADD COLUMN foto_lokasi VARCHAR(255) DEFAULT NULL");
    }

    const [budidayaRaksCol] = await db.query("SHOW COLUMNS FROM budidaya LIKE 'jumlah_rak'");
    if (budidayaRaksCol.length === 0) {
      await db.query("ALTER TABLE budidaya ADD COLUMN jumlah_rak INT(11) DEFAULT 1");
    }

    const [detailCol] = await db.query("SHOW COLUMNS FROM pertumbuhan LIKE 'detail_fase'");
    if (detailCol.length === 0) {
      await db.query("ALTER TABLE pertumbuhan ADD COLUMN detail_fase TEXT DEFAULT NULL");
    }

    const [oldSuhuCol] = await db.query("SHOW COLUMNS FROM pertumbuhan LIKE 'suhu'");
    if (oldSuhuCol.length > 0) {
      await db.query(`
        INSERT INTO lingkungan_harian (id_budidaya, id_petugas, tanggal_pengukuran, suhu, kelembaban, intensitas_cahaya)
        SELECT id_budidaya, id_petugas, tanggal_pengamatan, suhu, kelembaban, intensitas_cahaya
        FROM pertumbuhan
        WHERE (suhu IS NOT NULL OR kelembaban IS NOT NULL OR intensitas_cahaya IS NOT NULL)
          AND NOT EXISTS (
            SELECT 1 FROM lingkungan_harian lh
            WHERE lh.id_budidaya = pertumbuhan.id_budidaya
              AND lh.tanggal_pengukuran = pertumbuhan.tanggal_pengamatan
          )
      `);

      await db.query(`ALTER TABLE pertumbuhan DROP COLUMN suhu, DROP COLUMN kelembaban, DROP COLUMN intensitas_cahaya`);
    }
  } catch (err) {
    console.warn('Legacy schema migration failed:', err.code || err.message);
  }
}

module.exports = { ensureSchema };
