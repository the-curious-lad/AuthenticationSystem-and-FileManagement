const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Automatically creates TTL index for 5 minutes
    }
});
const OTP = mongoose.model('OTP', OTPSchema);
module.exports = OTP;