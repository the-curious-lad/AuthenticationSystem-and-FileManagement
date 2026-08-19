const nodemailer = require("nodemailer");
let connection = null;

// create or reuse transporter
const createTransport = async () => {

    
    if (connection) {
        return connection;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD,
        },
    });

    connection = transporter;
    return transporter;
};

// send email
const sendMail = async (to, subject, text) => {
    const transporter = await createTransport();

    const mailOptions = {
        from: process.env.APP_EMAIL,
        to,
        subject, // send otp for verification
        text,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendMail };
