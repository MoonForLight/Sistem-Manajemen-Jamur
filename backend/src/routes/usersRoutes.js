const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/me", authMiddleware, roleMiddleware("admin", "petugas"), usersController.me);

router.get("/petugas", authMiddleware, roleMiddleware("admin"), usersController.getPetugasList);

router.put("/me", authMiddleware, roleMiddleware("admin", "petugas"), usersController.updateMe);
router.put("/me/password", authMiddleware, roleMiddleware("admin", "petugas"), usersController.changePassword);

router.put("/:id", authMiddleware, roleMiddleware("admin"), usersController.updatePetugas);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), usersController.deletePetugas);

module.exports = router;