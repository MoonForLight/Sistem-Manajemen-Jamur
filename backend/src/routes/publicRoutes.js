const express = require("express");
const router = express.Router();

const publicController = require("../controllers/publicController");

router.get("/monitoring", publicController.getMonitoring);
router.post("/download-log", publicController.logDownload);

module.exports = router;
