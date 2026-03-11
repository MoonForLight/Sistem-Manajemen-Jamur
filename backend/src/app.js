const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testDbConnection } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const lokasiRoutes = require("./routes/lokasiRoutes");
const jenisJamurRoutes = require("./routes/jenisJamurRoutes");
const mediaTanamRoutes = require("./routes/mediaTanamRoutes");
const budidayaRoutes = require("./routes/budidayaRoutes");
const pertumbuhanRoutes = require("./routes/pertumbuhanRoutes");
const panenRoutes = require("./routes/panenRoutes");
const errorHandler = require("./middleware/errorHandler");
const usersRoutes = require("./routes/usersRoutes");

const app = express();

app.use(cors());
app.use(express.json());

//test dulu
testDbConnection();

app.get("/health", (req, res) => {
  res.send("API Jamur Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/lokasi", lokasiRoutes);
app.use("/api/jenis-jamur", jenisJamurRoutes);
app.use("/api/media-tanam", mediaTanamRoutes);
app.use("/api/budidaya", budidayaRoutes);
app.use("/api/pertumbuhan", pertumbuhanRoutes);
app.use("/api/panen", panenRoutes);
app.use("/api/users", usersRoutes);
app.use(errorHandler);

module.exports = app;