const rateLimit = require('express-rate-limit');

const generalRateLimiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 4,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => {
        return res.status(429).json({
            message: "Too many requests. Please try again later."
        });
    }
});

module.exports = { generalRateLimiter };
