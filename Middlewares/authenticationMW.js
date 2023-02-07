const { response } = require("express");
const { param } = require("express-validator");
const { request } = require("http");

const jwt = require("jsonwebtoken");

module.exports = (request, response, next)=>{
    try
    {
        let token = request.get("authorization").split(" ")[1];
        let decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        //console.log(token);
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


// module.exports.isAdmin=(request, response, next)=> {
//     if (request.role == 'admin')
//     {
//         console.log(request.role)
//         next();
//     }
//     else {
//         let error= new Error("Not Authorized")
//         error.status=403;
//         next(error)
//     }
// }

// module.exports.isDoctor=(request, response, next)=> {
//     if ((request.role == 'doctor'))
//     {
//         console.log(request.role)
//         console.log(request.params.id)
//         console.log(request.id)
//         next();
//     }
//     else {
//         let error= new Error("Not Authorized")
//         error.status=403;
//         next(error)
//     }
// }

// //&&(request.id==request.params.id)

// module.exports.isDoctorOrAdmin=(request, response, next)=> {
//     if ((request.role == 'doctor')||(request.role == 'admin'))
//     {
//         console.log(request.role)
//         console.log(request.params.id)
//         console.log(request.id)
//         next();
//     }
//     else {
//         let error= new Error("Not Authorized")
//         error.status=403;
//         next(error)
//     }
// }

// module.exports.isPatient=(request, response, next)=> {
//     if ((request.role == 'patient'))
//     {
//         console.log(request.role)
//         console.log(request.params.id)
//         console.log(request.id)
//         next();
//     }
//     else {
//         let error= new Error("Not Authorized")
//         error.status=403;
//         next(error)
//     }
// }

// module.exports.isPatientOrDoctor=(request, response, next)=> {
//     if ((request.role == 'patient')||(request.role == 'admin'))
//     {
//         next();
//     }
//     else {
//         let error= new Error("Not Authorized")
//         error.status=403;
//         next(error)
//     }
// }

// module.exports.isDoctorOrAdminOrPatient=(request, response, next)=> {
//     if ((request.role == 'doctor')||(request.role == 'admin')||(request.role == 'patient'))
//     {
//         next();
//     }
//     else {
//         let error= new Error("Not Authorized")
//         error.status=403;
//         next(error)
//     }
// }

// module.exports.isPatientOrAdmin=(request, response, next)=> {
//     if ((request.role == 'patient')||(request.role == 'admin'))
//     {
//         next();
//     }
//     else {
//         let error= new Error("Not Authorized")
//         error.status=403;
//         next(error)
//     }
// }


// module.exports.isEmployee=(request, response, next)=> {
//     if (request.role == 'employee')
//     {
//         next();
//     }
//     else {
//         let error= new Error("Not Authorized")
//         error.status=403;
//         next(error)
//     }
// }

// module.exports.anyUser=(request, response, next)=> {
//     if ((request.role == 'patient')||(request.role == 'admin')||(request.role == 'employee')||(request.role == 'doctor'))
//     {
//         next();
//     }
//     else {
//         let error= new Error("Not Authorized")
//         error.status=403;
//         next(error)
//     }
// }