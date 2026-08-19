const zodloginuser = require('../validators/login.validator');

const validateuserforlogin = (req, res, next) => {
    const body = req.body;

    const parseResult = zodloginuser.safeParse(body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: parseResult.error.issues
        });
    }

    req.body = parseResult.data;
    next();
};

module.exports = validateuserforlogin;
