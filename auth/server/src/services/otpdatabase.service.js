const OTP = require('../models/otp');

const storeOTP = async(userId,otpObj) =>{
    const otp=otpObj.otp;
    const newOTP= new OTP({
        userId,
        otp
    })
    await newOTP.save(); 
    return newOTP;
};

const checkOTP= async(userId)=>{
    try{
    const otpobjchecked= await OTP.findOne({userId});
    if(!otpobjchecked){
        const err=new Error("NO_OTP");
        err.code="NO_OTP";
        throw err;
    }
    return otpobjchecked;
    }
    catch(err){
        throw err;
    }    
}

const deleteOTP= async(userId) =>{
    await OTP.deleteOne({userId});
}

module.exports= {storeOTP, checkOTP , deleteOTP};