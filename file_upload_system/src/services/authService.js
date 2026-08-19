const userDatabaseServices = require("./userdatabaseServices");
const { hashPassword, comparePassword } = require("../utils/hashpassword.util");
const { generateToken } = require("../utils/jwt.utils");

const signup = async (username, email, password) => {

    const existingUserByEmail = await userDatabaseServices.findUserByEmail(email);
    if (existingUserByEmail) {
        const err = new Error("Email already in use");
        err.code = "EMAIL_EXISTS";
        throw err;
    }

    const existingUserByUsername = await userDatabaseServices.findUserByUsername(username);
    if (existingUserByUsername) {
        const err = new Error("Username already in use");
        err.code = "USERNAME_EXISTS";
        throw err;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await userDatabaseServices.createUser({
        username,
        email,
        password: hashedPassword
    });

    const { password: _, ...safeUser } = newUser;

    const token = generateToken({
        id: safeUser.id,
        email: safeUser.email,
        role: safeUser.role
    });

    return { user: safeUser, token };
};

const login = async (email, password) => {

    const user = await userDatabaseServices.findUserByEmail(email);

    if (!user) {
        const error = new Error("Invalid Credentials");
        error.code = "INVALID_CREDENTIALS";
        throw error;
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
        const error = new Error("Invalid Credentials");
        error.code = "INVALID_CREDENTIALS";
        throw error;
    }

    const { password: _, ...safeUser } = user;

    const token = generateToken({
        id: safeUser.id,
        email: safeUser.email,
        role: safeUser.role
    });

    return { user: safeUser, token };
};

module.exports = {
    signup,
    login
};