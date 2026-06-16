const express = require('express');
const router = express.Router();

const budidayaController = require('../controllers/budidayaController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/summary', authMiddleware, budidayaController.getSummary);
router.get('/petugas/me', authMiddleware, roleMiddleware('admin', 'petugas'), budidayaController.getByPetugas);

router.get('/', authMiddleware, budidayaController.getAll);
router.get('/:id', authMiddleware, budidayaController.getById);
router.get('/:id/backup', authMiddleware, roleMiddleware('admin'), budidayaController.getBackupData);

router.post('/', authMiddleware, roleMiddleware('admin', 'petugas'), budidayaController.create);
router.patch('/:id/target-harian', authMiddleware, roleMiddleware('admin'), budidayaController.updateDailyTargets);
router.patch('/:id/selesaikan', authMiddleware, roleMiddleware('admin', 'petugas'), budidayaController.selesaikan);
router.put('/:id', authMiddleware, roleMiddleware('admin'), budidayaController.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), budidayaController.remove);

module.exports = router;
