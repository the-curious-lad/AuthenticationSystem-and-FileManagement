const express = require("express");
const router = express.Router();

const signupController = require("../controllers/signupController");
const loginController = require("../controllers/loginController");
const {generalRateLimiter} = require("../middleware/rateLimiter");

router.use(generalRateLimiter);

router.post("/signup", signupController);
router.post("/login", loginController);

module.exports = router;