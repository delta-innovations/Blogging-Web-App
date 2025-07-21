const bcrypt = require("bcryptjs");

const storedHash = "$2b$12$OppLzd5T4DvC/0sW.kJ9T.XayuwGn8W0.nN0cK.c8MWU9aNNFzbMm"; // Replace with your actual stored hash
const inputPassword = "Suresh123$"; // The password you are trying to login with

bcrypt.compare(inputPassword, storedHash).then(match => {
    console.log(match ? "✅ Password matches!" : "❌ Password mismatch!");
});
