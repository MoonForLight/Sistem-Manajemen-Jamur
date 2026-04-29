const { db } = require('./src/config/db');

async function migrate() {
  try {
    console.log("Checking if email column exists...");
    const [cols] = await db.query("SHOW COLUMNS FROM users LIKE 'email'");
    if (cols.length === 0) {
      console.log("Adding email and no_hp columns...");
      await db.query("ALTER TABLE users ADD COLUMN email VARCHAR(100) NULL, ADD COLUMN no_hp VARCHAR(20) NULL");
      console.log("Migration successful.");
    } else {
      console.log("Columns already exist.");
    }
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

migrate();
