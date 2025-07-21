const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true // Indexing for faster lookups
    },
    expiryDate: {
        type: Date,
        required: true,
        expires: 0 // Enables TTL index, automatically removes expired tokens
    }
});

// Create TokenBlacklist model
const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);

module.exports = TokenBlacklist;