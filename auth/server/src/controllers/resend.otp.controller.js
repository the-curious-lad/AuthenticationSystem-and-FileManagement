const Userdatabase = require('../services/database.services');
const otpdatabaseServices = require('../services/otpdatabase.service');
const otpServices = require('../services/otp.service');

const resendOtpController = async (req, res) => {

    const { email } = req.body;

    try {

        const user = await Userdatabase.checkbyMail(email);

        if (user.isVerified) {
            const err = new Error("USER_ALREADY_VERIFIED");
            err.code = "USER_ALREADY_VERIFIED";
            throw err;
        }

        // remove previous OTP
        await otpdatabaseServices.deleteOTP(user._id);

        const otpObj = await otpServices.mailSend(email);

        await otpdatabaseServices.storeOTP(user._id, otpObj);

        return res.status(200).json({
            message: "OTP resent successfully"
        });

    } catch (err) {

        if (err.code === "USER_ALREADY_VERIFIED") {
            return res.status(409).json({ message: "User already verified" });
        }

        if (err.code === "USER_NOT_FOUND") {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = { resendOtpController };