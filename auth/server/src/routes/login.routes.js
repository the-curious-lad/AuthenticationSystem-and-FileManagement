const express = require('express');
const router = express.Router();

const { generalRateLimiter } = require('../middlewares/ratelimiter.middleware');
const validateuserforlogin = require('../middlewares/login.zod.valid.middleware');
const logincontroller = require('../controllers/login.controller');


router.use(generalRateLimiter);

router.post('/login', validateuserforlogin, logincontroller);

module.exports = router;
