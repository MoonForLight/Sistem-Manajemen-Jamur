const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const userModel = require("../models/usersModel");
const lokasiModel = require("../models/lokasiModel");

exports.register = async (req, res) => {
  try {
    const { nama, username, password, role, id_lokasi } = req.body;

    if (!nama || !username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "nama, username, password, role wajib diisi",
      });
    }

    if (role !== "petugas") {
      return res.status(400).json({
        success: false,
        message: "Register hanya untuk petugas. Admin dibuat manual oleh sistem.",
      });
    }

    // petugas wajib punya lokasi
    if (id_lokasi === undefined || id_lokasi === null || id_lokasi === "") {
      return res.status(400).json({
        success: false,
        message: "Petugas wajib memilih id_lokasi. Buat lokasi dulu jika belum ada.",
      });
    }

    const lokasiAda = await lokasiModel.existsLokasi(id_lokasi);
    if (!lokasiAda) {
      return res.status(400).json({
        success: false,
        message: `Lokasi dengan id ${id_lokasi} tidak ditemukan. Buat lokasi dulu.`,
      });
    }

    // 4) username unik
    const existing = await userModel.findUserByUsername(username);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "username sudah digunakan",
      });
    }

    // 5) simpan user + petugas
    const passwordHash = await bcrypt.hash(password, 10);
    const id_user = await userModel.createUser({ nama, username, passwordHash });

    await userModel.setAsPetugas({
      id_user,
      id_lokasi,
      status: "aktif",
    });

    return res.status(201).json({
      success: true,
      message: "Register petugas berhasil",
      data: { id_user, nama, username, role: "petugas", id_lokasi },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "username dan password wajib diisi",
      });
    }

    const user = await userModel.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "username atau password salah",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "username atau password salah",
      });
    }

    const role = await userModel.getRole(user.id_user);

    const token = generateToken({
      id_user: user.id_user,
      username: user.username,
      role,
    });

    return res.json({
      success: true,
      message: "Login berhasil",
      data: {
        token,
        user: {
          id_user: user.id_user,
          nama: user.nama,
          username: user.username,
          role,
        },
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};