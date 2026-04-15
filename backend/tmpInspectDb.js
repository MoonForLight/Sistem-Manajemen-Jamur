const mysql = require('mysql2/promise');
(async () => {
  try {
    const db = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'manajemen_jamur' });
    const [tables] = await db.query('SHOW TABLE STATUS');
    console.log('TABLES', tables.map(r => ({ Name: r.Name, Engine: r.Engine, Comment: r.Comment })));
    const [refs] = await db.query(
      "SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA='manajemen_jamur' AND REFERENCED_TABLE_NAME IS NOT NULL"
    );
    console.log('FK', refs);
    await db.end();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
