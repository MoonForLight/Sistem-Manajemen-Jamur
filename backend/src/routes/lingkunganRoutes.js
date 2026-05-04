const express = require("express");
const router = express.Router();
const lingkunganController = require("../controllers/lingkunganController");
const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

router.use(auth);

router.get("/", lingkunganController.getAll);
router.get("/budidaya/:id_budidaya", lingkunganController.getByBudidaya);
router.get("/:id", lingkunganController.getById);

router.post("/", checkRole("admin", "petugas"), lingkunganController.create);
router.put("/:id", checkRole("admin", "petugas"), lingkunganController.update);
router.delete("/:id", checkRole("admin"), lingkunganController.remove);

module.exports = router;
