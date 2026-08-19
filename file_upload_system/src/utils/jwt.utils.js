const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// generate token
const generateToken = (user) => {
  const payload = {
    id: user.id,
    role: user.role || "user"
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256"
  });
};

// verify token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const error = new Error("INVALID_TOKEN");
    error.code = "INVALID_TOKEN";
    throw error;
  }
};

module.exports = {
  generateToken,
  verifyToken
};