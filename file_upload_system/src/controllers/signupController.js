const { signup } = require("../services/authService");
const jwtUtility = require("../utils/jwt.utils");

const signupController = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await signup(username, email, password);

        const token = jwtUtility.generateToken({
            id: user.id,
            email: user.email
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // change to true in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "Signup successful",
            user
        });

    } catch (err) {
        if (err.code === "EMAIL_EXISTS" || err.code === "USERNAME_EXISTS") {
            return res.status(400).json({ message: err.message });
        }

        console.error("Signup error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = signupController;