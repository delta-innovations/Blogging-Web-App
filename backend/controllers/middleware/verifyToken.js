const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
        return res.status(403).json({ message: 'Token revoked. Please log in again.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;