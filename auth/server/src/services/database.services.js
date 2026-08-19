
const User = require("../models/user");

// check if email or username already exists
const findUser = async (email, username) => {

    const emailUser = await User.findOne({ email });
    if (emailUser) {
        const err = new Error("EMAIL_CONFLICT");
        err.code = "EMAIL_CONFLICT";
        throw err;
    }

    const usernameUser = await User.findOne({ username });
    if (usernameUser) {
        const err = new Error("USERNAME_CONFLICT");
        err.code = "USERNAME_CONFLICT";
        throw err;
    }

    return null;
};

// find user by email (used for login / OTP verification)
const checkbyMail = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        const err = new Error("USER_NOT_FOUND");
        err.code = "USER_NOT_FOUND";
        throw err;
    }

    return user;
};

// find user by username
const checkbyUsername = async (username) => {
    const user = await User.findOne({ username });

    if (!user) {
        const err = new Error("USER_NOT_FOUND");
        err.code = "USER_NOT_FOUND";
        throw err;
    }

    return user;
};

// create user
const createUser = async (email, username, password) => {
    const user = new User({
        email,
        username,
        password,
        isVerified: false
    });

    await user.save();
    return user;
};

module.exports = {
    findUser,
    checkbyMail,
    checkbyUsername,
    createUser
};

