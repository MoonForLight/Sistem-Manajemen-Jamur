const express = require("express");
const router = express.Router();

const lokasiController = require("../controllers/lokasiController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public: lokasi listing and detail are available without login
router.get("/", lokasiController.getAll);
router.get("/:id", lokasiController.getById);

// Admin-only: create/update/delete lokasi
router.post("/", authMiddleware, roleMiddleware("admin"), lokasiController.create);
router.put("/:id", authMiddleware, roleMiddleware("admin"), lokasiController.update);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), lokasiController.remove);

module.exports = router;