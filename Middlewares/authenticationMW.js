const { response } = require("express");
const { request } = require("http");

const jwt = require("jsonwebtoken");

module.exports = (request, response, next)=>{
    try
    {
        let token = request.get("authorization").split(" ")[1];
        let decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        console.log(token);
        request.id=decodedToken.id;
        request.role = decodedToken.role; 
        // console.log(decodedToken);
    }
    catch(error)
    {
        error.status=403;
        error.message = "Not Authorized"
        next(error)
    }
   
    next();
}   


module.exports.isAdmin=(request, response, next)=> {
    if (request.role == 'admin')
    {
        next();
    }
    else {
        error.status=403;
        error.message = "Not Authorized"
        next(error)
    }
}

module.exports.isDoctor=(request, response, next)=> {
    if (request.role == 'doctor')
    {
        next();
    }
    else {
        error.status=403;
        error.message = "Not Authorized"
        next(error)
    }
}


module.exports.isPatient=(request, response, next)=> {
    if (request.role == 'patient')
    {
        next();
    }
    else {
        error.status=403;
        error.message = "Not Authorized"
        next(error)
    }
}

module.exports.isEmployee=(request, response, next)=> {
    if (request.role == 'employee')
    {
        next();
    }
    else {
        error.status=403;
        error.message = "Not Authorized"
        next(error)
    }
}