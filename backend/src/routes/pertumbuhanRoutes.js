const express = require("express");
const router = express.Router();

const pertumbuhanController = require("../controllers/pertumbuhanController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// lihat data (admin & petugas)
router.get("/", authMiddleware, roleMiddleware("admin", "petugas"), pertumbuhanController.getAll);
router.get("/:id", authMiddleware, roleMiddleware("admin", "petugas"), pertumbuhanController.getById);
router.get("/budidaya/:id_budidaya", authMiddleware, roleMiddleware("admin", "petugas"), pertumbuhanController.getByBudidaya);

// input/update (admin & petugas)
router.post("/", authMiddleware, roleMiddleware("admin", "petugas"), pertumbuhanController.create);
router.put("/:id", authMiddleware, roleMiddleware("admin", "petugas"), pertumbuhanController.update);

// hapus (admin saja)
router.delete("/:id", authMiddleware, roleMiddleware("admin"), pertumbuhanController.remove);

module.exports = router;