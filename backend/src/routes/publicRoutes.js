const express = require('express');
const router = express.Router();

const publicController = require('../controllers/publicController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/monitoring', publicController.getMonitoring);
router.post('/download-log', publicController.logDownload);
router.get(
  '/admin/rekap-download-top',
  authMiddleware,
  roleMiddleware('admin'),
  publicController.getDownloadRekapTop
);

module.exports = router;
