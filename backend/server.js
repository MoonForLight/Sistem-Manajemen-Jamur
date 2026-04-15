const app = require("./src/app");
const { testDbConnection } = require("./src/config/db");
const { ensureSchema } = require("./src/config/dbMigration");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await testDbConnection();
    await ensureSchema();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server because database connection failed.");
    console.error(err);
    process.exit(1);
  }
})();