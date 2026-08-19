const verifyotpservice = (otp,otpdatabaseobj) =>{
    const storedOTP=otpdatabaseobj.otp;
    if(storedOTP===otp){
        return true;
    }
    else{
        const err=new Error("INVALID_OTP");
        err.code="INVALID_OTP";
        throw err;
    }
}

module.exports= verifyotpservice;