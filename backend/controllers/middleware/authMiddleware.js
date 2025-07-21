const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token =
    req.header("Authorization")?.replace("Bearer ", "") || req.query.token;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Token expired. Please log in again." });
      }
      return res.status(403).json({ message: "Invalid token." });
    }
    
    req.user = decoded; // Attach user info to request
    next();
  });
};

module.exports = authMiddleware;