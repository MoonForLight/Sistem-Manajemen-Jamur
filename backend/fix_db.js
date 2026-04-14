const mysql = require('mysql2/promise');

(async () => {
  const db = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'manajemen_jamur' });
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS admin (
        id_admin INT(11) NOT NULL AUTO_INCREMENT,
        id_user INT(11) NOT NULL,
        PRIMARY KEY (id_admin),
        UNIQUE KEY idx_admin_user (id_user)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

      CREATE TABLE IF NOT EXISTS petugas (
        id_petugas INT(11) NOT NULL AUTO_INCREMENT,
        id_user INT(11) NOT NULL,
        id_lokasi INT(11) DEFAULT NULL,
        status VARCHAR(50) NOT NULL,
        PRIMARY KEY (id_petugas),
        UNIQUE KEY idx_petugas_user (id_user)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

      INSERT INTO admin (id_user)
        SELECT id_user FROM users WHERE username = 'admin1' AND id_user NOT IN (SELECT id_user FROM admin);

      INSERT INTO petugas (id_user, id_lokasi, status)
        SELECT id_user, NULL, 'aktif' FROM users WHERE username = 'petugas1' AND id_user NOT IN (SELECT id_user FROM petugas);
    `;

    const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
    for (const statement of statements) {
      await db.query(statement);
    }

    console.log('Database fix applied.');
  } catch (err) {
    console.error('Database fix failed:', err);
  } finally {
    await db.end();
  }
})();
