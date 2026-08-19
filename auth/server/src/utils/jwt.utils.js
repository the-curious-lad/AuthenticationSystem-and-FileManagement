const jwt = require("jsonwebtoken");

// generate token
const generateToken = (user) => {
    const payload = {
        userId: user._id
    };

    return jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
            algorithm: "HS256"
        }
    );
};

// verify token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        const error = new Error("INVALID_TOKEN");
        error.code = "INVALID_TOKEN";
        throw error;
    }
};

module.exports = { generateToken, verifyToken };
