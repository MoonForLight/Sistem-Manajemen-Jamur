const express = require("express");
const router = express.Router();

const mediaTanamController = require("../controllers/mediaTanamController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// semua login boleh lihat
router.get("/", authMiddleware, mediaTanamController.getAll);
router.get("/:id", authMiddleware, mediaTanamController.getById);

// admin-only
router.post("/", authMiddleware, roleMiddleware("admin"), mediaTanamController.create);
router.put("/:id", authMiddleware, roleMiddleware("admin"), mediaTanamController.update);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), mediaTanamController.remove);

module.exports = router;