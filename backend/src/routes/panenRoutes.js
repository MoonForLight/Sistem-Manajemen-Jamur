const express = require('express');
const router = express.Router();

const panenController = require('../controllers/panenController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const imageUpload = require('../middleware/imageUpload');

router.get('/', authMiddleware, roleMiddleware('admin', 'petugas'), panenController.getAll);
router.get('/budidaya/:id_budidaya', authMiddleware, roleMiddleware('admin', 'petugas'), panenController.getByBudidaya);
router.get('/:id', authMiddleware, roleMiddleware('admin', 'petugas'), panenController.getById);

router.post('/', authMiddleware, roleMiddleware('admin', 'petugas'), imageUpload.single('foto'), panenController.create);
router.put('/:id', authMiddleware, roleMiddleware('admin', 'petugas'), imageUpload.single('foto'), panenController.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), panenController.remove);

module.exports = router;
