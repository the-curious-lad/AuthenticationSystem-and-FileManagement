const checkIdentifier = require("../utils/identifiercheck.utils");
const databaseServices = require("../services/database.services");
const hashUtilities = require("../utils/hashpassword.utils");

const loginservice = async (identifier, password) => {
    const isEmail = checkIdentifier(identifier);

    // fetch user
    const user = isEmail
        ? await databaseServices.checkbyMail(identifier)
        : await databaseServices.checkbyUsername(identifier);

    // check verification
    if (!user.isVerified) {
        const err = new Error("USER_NOT_VERIFIED");
        err.code = "USER_NOT_VERIFIED";
        throw err;
    }

    // compare password
    const isPasswordCorrect = await hashUtilities.comparePasswords(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        const err = new Error("INVALID_CREDENTIALS");
        err.code = "INVALID_CREDENTIALS";
        throw err;
    }

    return user;
};

module.exports = loginservice;
