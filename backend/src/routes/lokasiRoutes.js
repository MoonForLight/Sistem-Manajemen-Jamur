const express = require("express");
const router = express.Router();

const lokasiController = require("../controllers/lokasiController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Semua harus login untuk lihat lokasi
router.get("/", authMiddleware, lokasiController.getAll);
router.get("/:id", authMiddleware, lokasiController.getById);

// Admin saja boleh create/update/delete
router.post("/", authMiddleware, roleMiddleware("admin"), lokasiController.create);
router.put("/:id", authMiddleware, roleMiddleware("admin"), lokasiController.update);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), lokasiController.remove);

module.exports = router;