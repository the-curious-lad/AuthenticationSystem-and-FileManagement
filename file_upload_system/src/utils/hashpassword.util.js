const bcrypt = require("bcrypt");

const PEPPER = process.env.SITE_PEPPER;

const hashPassword = async (password) => {
  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS);

    const hashedPassword = await bcrypt.hash(password + PEPPER, saltRounds);

    return hashedPassword;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    const result = await bcrypt.compare(password + PEPPER, hashedPassword);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};