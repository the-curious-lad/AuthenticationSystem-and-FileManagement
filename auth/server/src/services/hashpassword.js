const {hashPassword} = require("../utils/hashpassword.utils");

const hashpasswordservice= async(password) =>{
    return await hashPassword(password);
};

module.exports = hashpasswordservice;