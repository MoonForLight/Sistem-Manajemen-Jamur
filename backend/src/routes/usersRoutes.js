const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// profil user yang sedang login (admin/petugas)
router.get("/me", authMiddleware, roleMiddleware("admin", "petugas"), usersController.me);

// admin-only: list petugas
router.get("/petugas", authMiddleware, roleMiddleware("admin"), usersController.getPetugasList);

module.exports = router;