const jwt = require('jsonwebtoken');

// 🔒 Validate environment variables at startup
if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('Missing JWT secrets in .env file');
}

// ✅ Generate Access Token (Short-lived)
const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user._id, role: user.role, iat: Math.floor(Date.now() / 1000) }, 
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m', algorithm: 'HS256' }
    );
};

// ✅ Generate Refresh Token (Longer-lived)
const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user._id, jti: Math.random().toString(36).substring(2) }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: '7d', algorithm: 'HS256' }
    );
};

// ✅ Verify Access Token
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        console.error('❌ Access token verification failed:', error.message);
        return null; // Return null instead of an object
    }
};

// ✅ Verify Refresh Token
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        console.error('❌ Refresh token verification failed:', error.message);
        return null; // Return null instead of an object
    }
};

module.exports = { 
    generateAccessToken, 
    generateRefreshToken, 
    verifyAccessToken, 
    verifyRefreshToken 
};
