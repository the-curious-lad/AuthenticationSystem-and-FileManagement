const express = require("express");
const Userdatabase = require("../services/database.services");
const otpdatabaseServices = require("../services/otpdatabase.service");
const verifyotpservice =
  require("../services/otpverification.services");

const verifyOtpcontroller = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await Userdatabase.checkbyMail(email);
    if (user.isVerified === true) {
      const err = new Error("USER_ALREADY_VERIFIED");
      err.code = "USER_ALREADY_VERIFIED";
      throw err;
    }
    const checkotpdatabase = await otpdatabaseServices.checkOTP(user._id);
    const verification = verifyotpservice(otp, checkotpdatabase);
    if (verification) {
      user.isVerified = true;
      await user.save();
      await otpdatabaseServices.deleteOTP(user._id);
      return res.status(200).json({ message: "User verified successfully" });
    }
  } catch (err) {
    if (err.code === "USER_ALREADY_VERIFIED") {
      return res.status(409).json({ message: "User already verified" });
    }

    if (err.code === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found" });
    }

    if (err.code === "NO_OTP") {
      return res
        .status(400)
        .json({ message: "OTP expired or not found.Request a new one." });
    }

    if (err.code === "INVALID_OTP") {
      return res.status(400).json({ message: "Wrong OTP filled" });
    }

    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = { verifyOtpcontroller };
