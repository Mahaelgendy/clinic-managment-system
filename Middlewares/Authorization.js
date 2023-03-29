const express= require("express");
const authenticationMW=require("./../Middlewares/authenticationMW")



module.exports.isAdmin=(request, response, next)=> {
    console.log("request")

    if (request.role == 'admin')
    {
        console.log(request.role)
        next();
    }
    else {
        let error= new Error("Not Authorized")
        error.status=403;
        next(error)
    }
}

module.exports.isDoctor=(request, response, next)=> {
    if ((request.role == 'doctor'))
    {
        console.log(request.role)

        next();
    }
    else {
        let error= new Error("Not Authorized")
        error.status=403;
        next(error)
    }
}


module.exports.isDoctorOrAdmin=(request, response, next)=> {
    if ((request.role == 'doctor')||(request.role == 'admin'))
    {
        console.log(request.role)
     
        next();
    }
    else {
        let error= new Error("Not Authorized")
        error.status=403;
        next(error)
    }
}

module.exports.isPatient=(request, response, next)=> {
    if ((request.role == 'patient'))
    {
        console.log(request.role)
        console.log(request.params.id)
        console.log(request.id)
        next();
    }
    else {
        let error= new Error("Not Authorized")
        error.status=403;
        next(error)
    }
}

module.exports.isPatientOrDoctor=(request, response, next)=> {
    if ((request.role == 'patient')||(request.role == 'doctor'))
    {
        next();
    }
    else {
        let error= new Error("Not Authorized")
        error.status=403;
        next(error)
    }
}

module.exports.isDoctorOrAdminOrPatient=(request, response, next)=> {
    console.log("Here")
    if ((request.role == 'doctor')||(request.role == 'admin')||(request.role == 'patient'))
    {
        next();
    }
    else {
        let error= new Error("Not Authorized")
        error.status=403;
        next(error)
    }
}

module.exports.isPatientOrAdmin=(request, response, next)=> {
    if ((request.role == 'patient')||(request.role == 'admin'))
    {
        next();
    }
    else {
        let error= new Error("Not Authorized")
        error.status=403;
        next(error)
    }
}


module.exports.isEmployee=(request, response, next)=> {
    if (request.role == 'employee')
    {
        next();
    }
    else {
        let error= new Error("Not Authorized")
        error.status=403;
        next(error)
    }
}

module.exports.isEmployeeOrAdmin=(request, response, next)=> {
    if ((request.role == 'employee')||(request.role == 'admin'))
    {
        next();
    }
    else {
        let error= new Error("Not Authorized")
        error.status=403;
        next(error)
    }
}
module.exports.isEmployeeOrPatient=(request, response, next)=> {
    if ((request.role == 'employee')||(request.role == 'patient'))
    {
        next();
    }
    else {
        let error= new Error("Not Authorized")
        error.status=403;
        next(error)
    }
}
module.exports.isStaff=(request, response, next)=> {
    if ((request.role == 'admin')||(request.role == 'employee')||(request.role == 'doctor'))
    {
        next();
    }
    else {
        let error= new Error("Not Authorized")
        error.status=403;
        next(error)
    }
}

module.exports.anyUser=(request, response, next)=> {
    if ((request.role == 'patient')||(request.role == 'admin')||(request.role == 'employee')||(request.role == 'doctor'))
    {
        next();
    }
    else {
        let error= new Error("Not Authorized")
        error.status=403;
        next(error)
    }
}

