const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook for password hashing using callback method
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  const user = this;
  bcrypt.genSalt(12, function (err, salt) {
    if (err) return next(err);
    
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      
      user.password = hash;
      next();
    });
  });
});

// Compare password method
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

// Middleware to clean up refresh tokens before removing user
userSchema.pre("remove", function (next) {
  this.refreshTokens = []; // Clears refresh tokens on user deletion
  next();
});

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;