const {request , response} = require("express");
const mongoose = require("mongoose");
require("../Models/clinicModel");
const clinicSchema =  mongoose.model("clinics");

exports.getAllClinics = (request , response, next)=>{
<<<<<<< HEAD

=======
>>>>>>> feb9adbe8a330721e5806de11106580a1082a41d
    clinicSchema.find()
    .then(data=>{
        console.log(data)
        response.status(201).json(data)
    })
    .catch(error=>next(error));
}

exports.getClinicById = (request, response ,next)=>{
    
    clinicSchema.findOne({_id:request.params.id})
    .then(data => {
        if(data != null){
            response.status(201).json({data})
        }else {
            console.log("null")
            next(new Error({message:"Id is not exist"}));
        }
    })
    .catch(error => next(error));
}

exports.addClinic =(request, response, next)=>{
    let newClinic = new clinicSchema({
        clinic_location:request.body.clinic_location,
    });
    console.log(newClinic)
    newClinic.save()
        .then(result =>{
            response.status(201).json({Message:"new clinic Add"});
        })
        .catch(error => next(error));
}

exports.deleteClinicById=(request, response,next)=>
{
    clinicSchema.findByIdAndDelete({_id:request.params.id})
    .then(result=>{
        response.status(200).json({message:"Delete with id "+request.params.id});
    })
    .catch(error=>next(error));
}

exports.updateClinic = (request,response , next)=>
{
    clinicSchema.updateOne(
        {_id: request.params.id},
        {$set:{
            clinic_location:request.body.clinic_location,
        }})
        .then(result=>{
            response.status(200).json({message:"updated"});
        })
        .catch(error=>next(error));

}









