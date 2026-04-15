const express = require("express");
const router = express.Router();

const publicController = require("../controllers/publicController");

router.get("/monitoring", publicController.getMonitoring);

module.exports = router;
