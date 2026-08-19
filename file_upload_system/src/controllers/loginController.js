const { login } = require("../services/authService");
const jwtUtility = require("../utils/jwt.utils");

const loginController = async (req, res) => {
    const { email, password } = req.body;

    try {
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await login(email, password);

        const token = jwtUtility.generateToken({
            id: user.id,
            email: user.email
        });

       
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful",
            user
        });

    } catch (err) {
        if (err.code === "INVALID_CREDENTIALS") {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = loginController;