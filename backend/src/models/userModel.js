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

module.exports = {
  findUserByUsername,
  createUser,
  setAsAdmin,
  setAsPetugas,
  getRole,
};