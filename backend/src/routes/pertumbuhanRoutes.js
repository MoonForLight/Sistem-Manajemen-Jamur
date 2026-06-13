const express = require("express");
const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

const pertumbuhanController = require("../controllers/pertumbuhanController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, roleMiddleware("admin", "petugas"), pertumbuhanController.getAll);
router.get("/:id", authMiddleware, roleMiddleware("admin", "petugas"), pertumbuhanController.getById);
router.get("/budidaya/:id_budidaya", authMiddleware, roleMiddleware("admin", "petugas"), pertumbuhanController.getByBudidaya);

router.post("/", authMiddleware, roleMiddleware("admin", "petugas"), upload.single('foto'), pertumbuhanController.create);
router.put("/:id", authMiddleware, roleMiddleware("admin", "petugas"), upload.single('foto'), pertumbuhanController.update);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), pertumbuhanController.remove);

module.exports = router;