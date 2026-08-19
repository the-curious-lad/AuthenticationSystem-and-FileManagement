const zoduser = require('../validators/signup.validators');

const validatezoduser =(req,res,next)=>{
    const body = req.body;
   
    const parseResult = zoduser.safeParse(body);
    if(!parseResult.success){
        return res.status(400).json({
            message: "Validation failed",
            errors: parseResult.error.issues
        });
    }
    else{
        req.body = parseResult.data;
        next();
    }
};

module.exports={validsignup: validatezoduser};