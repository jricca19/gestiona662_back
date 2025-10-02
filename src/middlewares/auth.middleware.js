const jwt = require("jsonwebtoken");
const { findUserByIdWhithCache } = require("../repositories/user.repository");
const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY;

const authMiddleWare = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Encabezado de autorización inválido" });
  }

  // Check if the token has the 'Bearer ' prefix for swagger compatibility
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1] // Extract token after 'Bearer '
    : authHeader; // Use the full header if no 'Bearer ' prefix

  if (!token) {
    return res.status(401).json({ message: "Token inválido" });
  }

  try {
    const verified = jwt.verify(token, AUTH_SECRET_KEY);
    const user = await findUserByIdWhithCache(verified.userId);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleWare;