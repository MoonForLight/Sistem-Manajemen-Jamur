const express = require("express");
const router = express.Router();

const jenisJamurController = require("../controllers/jenisJamurController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Semua login boleh lihat
router.get("/", authMiddleware, jenisJamurController.getAll);
router.get("/:id", authMiddleware, jenisJamurController.getById);

// Admin saja boleh ubah data master
router.post("/", authMiddleware, roleMiddleware("admin"), jenisJamurController.create);
router.put("/:id", authMiddleware, roleMiddleware("admin"), jenisJamurController.update);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), jenisJamurController.remove);

module.exports = router;