// Import models
const User = require('./User');
const BlogPost = require('./BlogPost');
const TokenBlacklist = require('./TokenBlacklist'); // Include TokenBlacklist model

// Export all models in a single object
module.exports = Object.freeze({
    User,
    BlogPost,
    TokenBlacklist
});