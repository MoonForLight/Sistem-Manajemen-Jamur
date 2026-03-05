const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; // "Bearer <token>"
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Token tidak ada" });
  }

  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Format token salah" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id_user, username, role }
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token tidak valid/expired" });
  }
}

module.exports = authMiddleware;