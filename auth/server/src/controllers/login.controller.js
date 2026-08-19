const loginservice = require('../services/login.service');
const jwtutils = require('../utils/jwt.utils');

const logincontroller = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await loginservice(identifier, password);

        
        const token = jwtutils.generateToken(user);

        return res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (err) {
        return res.status(400).json({
            message: "wrong credentials",
            error: err.message
        });
    }
};

module.exports = logincontroller;
