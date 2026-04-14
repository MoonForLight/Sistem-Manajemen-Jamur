const app = require("./src/app");
const { testDbConnection } = require("./src/config/db");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await testDbConnection();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server because database connection failed.");
    process.exit(1);
  }
})();