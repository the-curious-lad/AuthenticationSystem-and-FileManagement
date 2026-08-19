const checkIdentifier = (identifier="")=>{
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(identifier);
}

module.exports= checkIdentifier;