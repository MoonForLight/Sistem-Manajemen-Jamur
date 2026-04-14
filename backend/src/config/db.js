const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

async function testDbConnection() {
  try {
    await db.query("SELECT 1");
    console.log("Database Connected");
  } catch (err) {
    console.error("DB Error :", err.code || err.message || err);
    console.error("DB Details:", {
      code: err.code,
      errno: err.errno,
      sqlMessage: err.sqlMessage,
      sqlState: err.sqlState,
      fatal: err.fatal,
    });
    throw err;
  }
}

module.exports = { db, testDbConnection };