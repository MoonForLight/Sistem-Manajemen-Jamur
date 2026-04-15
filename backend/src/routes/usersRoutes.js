const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// profil user yang sedang login (admin/petugas)
router.get("/me", authMiddleware, roleMiddleware("admin", "petugas"), usersController.me);

// admin-only: list petugas
router.get("/petugas", authMiddleware, roleMiddleware("admin"), usersController.getPetugasList);

// admin/petugas: update own profile
router.put("/me", authMiddleware, roleMiddleware("admin", "petugas"), usersController.updateMe);
router.put("/me/password", authMiddleware, roleMiddleware("admin", "petugas"), usersController.changePassword);

// admin-only: update petugas
router.put("/:id", authMiddleware, roleMiddleware("admin"), usersController.updatePetugas);

// admin-only: delete petugas
router.delete("/:id", authMiddleware, roleMiddleware("admin"), usersController.deletePetugas);

module.exports = router;