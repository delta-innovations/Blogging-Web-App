// const bcrypt = require("bcryptjs");

// const password = "SecurePass123@";
// const saltRounds = 12;

// bcrypt.hash(password, saltRounds, (err, hash) => {
//   if (err) {
//     console.error("Error hashing password:", err);
//   } else {
//     console.log("Generated Hash:", hash);
//   }
// });


const crypto = require("crypto");
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZDM3ZTMzZTI0OWEyZWQxNWMyYTMzOSIsImlhdCI6MTc0MTkxODAzOCwiZXhwIjoxNzQyNTIyODM4fQ.Mey6lcQ6Wkxn7w_lpHLTzL66_i1DOKzcwY5HbrRVpGQ";
const hashed = crypto.createHash("sha256").update(token).digest("hex");
console.log(hashed); 