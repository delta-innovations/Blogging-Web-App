const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const redisClient = require("../config/redis");
const { validateRegisterInput, validateLoginInput } = require("../models/validation");
const crypto = require("crypto");

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const hashToken = (token) => {
  if (typeof token !== "string") {
    return null;
  }
  return crypto.createHash("sha256").update(token.trim()).digest("hex");
};

// Register Route
router.post('/register', validateRegisterInput, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const hashedRefreshToken = hashToken(refreshToken);

    await redisClient.del(`refresh:${user._id}`);
    await redisClient.set(`refresh:${user._id}`, hashedRefreshToken, {
      EX: 7 * 24 * 60 * 60,
    });

    res.status(201).json({
      message: 'User registered',
      accessToken,
      refreshToken,
      user: { _id: user._id, username, email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login Route
router.post('/login', validateLoginInput, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    user.comparePassword(password, async (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      const hashedRefreshToken = hashToken(refreshToken);

      await redisClient.del(`refresh:${user._id}`);
      await redisClient.set(`refresh:${user._id}`, hashedRefreshToken, {
        EX: 7 * 24 * 60 * 60,
      });

      res.status(200).json({
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: { _id: user._id, username: user.username, email: user.email },
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Refresh Token Route
router.post("/refresh", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const refreshToken = authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    let userId;
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      userId = decoded.id;
    } catch (error) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const hashedRefreshToken = hashToken(refreshToken);
    const storedToken = await redisClient.get(`refresh:${userId}`);

    if (!storedToken || storedToken !== hashedRefreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken({ _id: userId });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: "Authentication failed" });
  }
});

// Logout Route
router.post("/logout", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const refreshToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

    let userId;
    try {
      const decoded = jwt.decode(refreshToken);
      if (!decoded || !decoded.id) {
        return res.status(403).json({ message: "Invalid refresh token format" });
      }
      userId = decoded.id;
    } catch (error) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const hashedRefreshToken = hashToken(refreshToken);
    const storedToken = await redisClient.get(`refresh:${userId}`);

    if (!storedToken || storedToken !== hashedRefreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    await redisClient.del(`refresh:${userId}`);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
});

module.exports = router;