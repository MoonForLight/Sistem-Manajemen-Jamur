const mysql = require('mysql2/promise');

(async () => {
  const db = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'manajemen_jamur' });
  try {
    const [rows] = await db.query("SELECT id_user, nama, username, password FROM users WHERE username = 'admin1'");
    console.log('USER:', rows);
    if (rows.length) {
      const [adminRows] = await db.query('SELECT * FROM admin WHERE id_user = ?', [rows[0].id_user]);
      console.log('ADMIN ROWS:', adminRows);
      const [petugasRows] = await db.query('SELECT * FROM petugas WHERE id_user = ?', [rows[0].id_user]);
      console.log('PETUGAS ROWS:', petugasRows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await db.end();
  }
})();
