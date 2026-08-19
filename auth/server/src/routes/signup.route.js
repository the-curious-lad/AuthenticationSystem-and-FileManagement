const express = require('express');
const router = express.Router();

const { generalRateLimiter } = require('../middlewares/ratelimiter.middleware');
const {validsignup} = require('../middlewares/signup.zod.valid.middleware');

const { signupController } = require('../controllers/signup.controller');
const  {verifyOtpcontroller}  = require('../controllers/verifyotp.controller');
const { resendOtpController } = require('../controllers/resend.otp.controller');

router.use(generalRateLimiter);


router.post('/signup', validsignup, signupController);


router.post('/signup/verifyotp', verifyOtpcontroller);
router.post('/signup/resendotp', resendOtpController);

module.exports = router;
