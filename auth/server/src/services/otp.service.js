const sendingMail = require('../utils/mails.utils');
const otpCreation = require('../utils/otp.utils');

const mailSend = async (email) => {
    const otpObj = otpCreation.createOtp();  // { otp: "123456" }

    const subject = "OTP VERIFICATION";
    const text = `Your OTP for email verification is ${otpObj.otp}. Kindly verify your OTP`;

    await sendingMail.sendMail(email, subject, text);

    return otpObj;
};

module.exports= {mailSend};
