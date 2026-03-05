const express = require("express");
const router = express.Router();

const panenController = require("../controllers/panenController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, roleMiddleware("admin", "petugas"), panenController.getAll);
router.get("/:id", authMiddleware, roleMiddleware("admin", "petugas"), panenController.getById);
router.get("/budidaya/:id_budidaya", authMiddleware, roleMiddleware("admin", "petugas"), panenController.getByBudidaya);

router.post("/", authMiddleware, roleMiddleware("admin", "petugas"), panenController.create);
router.put("/:id", authMiddleware, roleMiddleware("admin", "petugas"), panenController.update);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), panenController.remove);

module.exports = router;