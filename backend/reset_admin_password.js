const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

(async () => {
  const db = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'manajemen_jamur' });
  try {
    const newPassword = 'Admin123!';
    const passwordHash = await bcrypt.hash(newPassword, 10);

    const [result] = await db.query(
      "UPDATE users SET password = ? WHERE username = 'admin1'",
      [passwordHash]
    );

    console.log('Updated rows:', result.affectedRows);
    console.log('New password for admin1 is:', newPassword);
  } catch (err) {
    console.error('Error updating password:', err);
  } finally {
    await db.end();
  }
})();
