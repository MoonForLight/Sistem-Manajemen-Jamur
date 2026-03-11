const { db } = require("../config/db");

async function findUserByUsername(username) {
  const [rows] = await db.query(
    "SELECT id_user, nama, username, password FROM users WHERE username = ?",
    [username]
  );
  return rows[0] || null;
}

async function createUser({ nama, username, passwordHash }) {
  const [result] = await db.query(
    "INSERT INTO users (nama, username, password) VALUES (?, ?, ?)",
    [nama, username, passwordHash]
  );
  return result.insertId;
}

async function setAsAdmin(id_user) {
  await db.query("INSERT INTO admin (id_user) VALUES (?)", [id_user]);
}

async function setAsPetugas({ id_user, id_lokasi = null, status = "aktif" }) {
  await db.query(
    "INSERT INTO petugas (id_user, id_lokasi, status) VALUES (?, ?, ?)",
    [id_user, id_lokasi, status]
  );
}

async function getRole(id_user) {
  // cek admin dulu
  const [adminRows] = await db.query("SELECT id_user FROM admin WHERE id_user = ?", [id_user]);
  if (adminRows.length > 0) return "admin";

  const [petugasRows] = await db.query("SELECT id_user FROM petugas WHERE id_user = ?", [id_user]);
  if (petugasRows.length > 0) return "petugas";

  return "unknown";
}

async function getAllPetugas() {
  const [rows] = await db.query(
    `SELECT 
        u.id_user,
        u.nama,
        u.username,
        p.status,
        p.id_lokasi,
        l.nama_lokasi
     FROM petugas p
     JOIN users u ON p.id_user = u.id_user
     LEFT JOIN lokasi l ON p.id_lokasi = l.id_lokasi
     ORDER BY u.id_user DESC`
  );
  return rows;
}

async function getUserBasicById(id_user) {
  const [rows] = await db.query(
    "SELECT id_user, nama, username FROM users WHERE id_user = ?",
    [id_user]
  );
  return rows[0] || null;
}

module.exports = {
  findUserByUsername,
  createUser,
  setAsAdmin,
  setAsPetugas,
  getRole,
  getAllPetugas,
  getUserBasicById,
};