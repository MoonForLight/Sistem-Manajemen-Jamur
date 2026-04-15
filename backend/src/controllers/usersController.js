const usersModel = require("../models/usersModel");
const lokasiModel = require("../models/lokasiModel");

exports.getPetugasList = async (req, res) => {
  const data = await usersModel.getAllPetugas();
  res.json({ success: true, data });
};

exports.updatePetugas = async (req, res) => {
  const id_user = Number(req.params.id);
  const { nama, username, id_lokasi, status } = req.body;

  if (!nama || !username) {
    return res.status(400).json({ success: false, message: 'nama dan username wajib diisi' });
  }

  const existingUser = await usersModel.findUserByUsernameExceptId(username, id_user);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'username sudah digunakan oleh akun lain' });
  }

  if (id_lokasi !== undefined && id_lokasi !== null && id_lokasi !== '') {
    const lokasiExists = await lokasiModel.existsLokasi(id_lokasi);
    if (!lokasiExists) {
      return res.status(400).json({ success: false, message: `Lokasi dengan id ${id_lokasi} tidak ditemukan` });
    }
  }

  const normalizedStatus = status === 'non-aktif' ? 'non-aktif' : 'aktif';

  const affectedUser = await usersModel.updateUser(id_user, { nama, username });
  const affectedPetugas = await usersModel.updatePetugas(id_user, { id_lokasi, status: normalizedStatus });

  if (affectedUser === 0 && affectedPetugas === 0) {
    return res.status(404).json({ success: false, message: 'Petugas tidak ditemukan' });
  }

  res.json({ success: true, message: 'Data petugas berhasil diupdate' });
};

exports.deletePetugas = async (req, res) => {
  const id_user = Number(req.params.id);
  const affected = await usersModel.deleteUser(id_user);

  if (affected === 0) {
    return res.status(404).json({ success: false, message: 'Petugas tidak ditemukan' });
  }

  res.json({ success: true, message: 'Petugas berhasil dihapus' });
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

exports.updateMe = async (req, res) => {
  const id_user = req.user.id_user;
  const { nama, username } = req.body;

  if (!nama || !username) {
    return res.status(400).json({ success: false, message: 'nama dan username wajib diisi' });
  }

  const existingUser = await usersModel.findUserByUsernameExceptId(username, id_user);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'username sudah digunakan oleh akun lain' });
  }

  const affectedUser = await usersModel.updateUser(id_user, { nama, username });
  if (affectedUser === 0) {
    return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
  }

  res.json({ success: true, message: 'Profil berhasil diperbarui' });
};

exports.changePassword = async (req, res) => {
  const id_user = req.user.id_user;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Password lama dan baru wajib diisi' });
  }

  const user = await usersModel.getUserBasicById(id_user);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
  }

  const fullUser = await usersModel.findUserByUsername(user.username);
  if (!fullUser) {
    return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
  }

  const bcrypt = require('bcryptjs');
  const match = await bcrypt.compare(currentPassword, fullUser.password);
  if (!match) {
    return res.status(400).json({ success: false, message: 'Password lama salah' });
  }

  await usersModel.updateUserPassword(id_user, newPassword);
  res.json({ success: true, message: 'Password berhasil diperbarui' });
};