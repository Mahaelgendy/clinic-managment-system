const {request , response} = require("express");
const mongoose = require("mongoose");
require("../Models/clinicModel");
const clinicSchema =  mongoose.model("clinics");

exports.getAllClinics = (request , response, next)=>{
    const query = {};
    if (request.query.clinicName) query.clinic_id = request.query.clinicName;
    if (request.query._id) query._id = request.query._id;

    clinicSchema.find(query)
    .then(data=>{
        console.log(data)
        response.status(201).json(data)
    })
    .catch(error=>next(error));
}

// exports.getClinicById = (request, response ,next)=>{
    
//     clinicSchema.findOne({_id:request.params.id})
//     .then(data => {
//         if(data != null){
//             response.status(201).json({data})
//         }else {
//             next(new Error({message:"Id is not exist"}));
//         }
//     })
//     .catch(error => next(error));
// }

exports.addClinic =(request, response, next)=>{
    let newClinic = new clinicSchema({
        clinic_location: request.body.clinic_location,
        clinicName: request.body.clinicName
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
            clinic_location: request.body.clinic_location,
            clinicName: request.body.clinicName
        }})
        .then(result=>{
            response.status(200).json({message:"updated"});
        })
        .catch(error=>next(error));

}







