const usersModel = require("../models/usersModel");

exports.getPetugasList = async (req, res) => {
  const data = await usersModel.getAllPetugas();
  res.json({ success: true, data });
};

exports.me = async (req, res) => {
  // req.user diisi oleh authMiddleware (dari token)
  const id_user = req.user.id_user;

  const user = await usersModel.getUserBasicById(id_user);
  if (!user) {
    return res.status(404).json({ success: false, message: "User tidak ditemukan" });
  }

  const role = await usersModel.getRole(id_user);

  res.json({
    success: true,
    data: { ...user, role },
  });
};