const bcrypt = require("bcrypt");
require("dotenv").config();

// hash password
const hashPassword = async (password) => {
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
    return await bcrypt.hash(password, saltRounds);
};

// compare password
const comparePasswords = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePasswords };
