const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { requireFields } = require("../middleware/validateMiddleware");

router.post("/login", requireFields(["username", "password"]), authController.login);

router.post(
  "/register",
  authMiddleware,
  roleMiddleware("admin"),
  requireFields(["nama", "username", "password", "role"]),
  authController.register
);

module.exports = router;