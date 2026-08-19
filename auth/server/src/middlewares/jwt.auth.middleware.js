const jwtutils = require('../utils/jwt.utils');

const jwtAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwtutils.verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = { jwtAuthMiddleware };
