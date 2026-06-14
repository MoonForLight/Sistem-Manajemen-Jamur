const express = require('express');
const router = express.Router();

const pertumbuhanController = require('../controllers/pertumbuhanController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const imageUpload = require('../middleware/imageUpload');

router.get('/', authMiddleware, roleMiddleware('admin', 'petugas'), pertumbuhanController.getAll);
router.get('/budidaya/:id_budidaya', authMiddleware, roleMiddleware('admin', 'petugas'), pertumbuhanController.getByBudidaya);
router.get('/:id', authMiddleware, roleMiddleware('admin', 'petugas'), pertumbuhanController.getById);

router.post('/', authMiddleware, roleMiddleware('admin', 'petugas'), imageUpload.single('foto'), pertumbuhanController.create);
router.put('/:id', authMiddleware, roleMiddleware('admin', 'petugas'), imageUpload.single('foto'), pertumbuhanController.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), pertumbuhanController.remove);

module.exports = router;
