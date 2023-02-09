const { response } = require("express");
const { param } = require("express-validator");
const { request } = require("http");

const jwt = require("jsonwebtoken");

module.exports = (request, response, next)=>{
    try
    {
        let token = request.get("authorization").split(" ")[1];
        let decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        request.id=decodedToken.id;
        request.role = decodedToken.role; 
    }
    catch(error)
    {
        error.status=403;
        error.message = "Not Authorized"
        next(error)
    }
   
    next();
}   
