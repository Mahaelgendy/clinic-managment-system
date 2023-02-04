const {request , response} = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("../Models/clinicModel");
const serviceSchema =  mongoose.model("services");

exports.getAllServices= (request , response, next)=>{

    serviceSchema.find()
    .populate({path:"doctor_id"})
    .populate({path:"clinic_id"})
    .then(data=>{
        response.status(201).json(data)
    })
    .catch(error=>next(error));
}

exports.getServiceById = (request, response ,next)=>{
    
    clinicSchema.findOne({_id:request.params.id})
    .then(data => {
        if(data != null){
            response.status(201).json({data})
        }else {
            response.status(404).json({message:"Id is not exist"})
        }
    })
    .catch(error => next(error));
}

exports.addservice =(request, response, next)=>{
    let newservice = new serviceSchema({
        name:request.body.name,
        salary:request.body.salary,
        doctor_id :request.body.doctor_id,
        clinic_id:request.body.clinic_id
    });
    console.log(newservice)
    newservice.save()
        .then(result =>{
            response.status(201).json({Message:"new service Add"});
        })
        .catch(error => next(error));
}

exports.deleteserviceById=(request, response,next)=>
{
    serviceSchema.findByIdAndDelete({_id:request.params.id})
    .then(result=>{
        response.status(200).json({message:"Delete service "});
    })
    .catch(error=>next(error));
}

exports.updateservice = (request,response , next)=>
{
    serviceSchema.updateOne(
        {_id: request.params.id},
        {$set:{
            name:request.body.name,
            salary:request.body.salary,
            doctor_id :request.body.doctor_id,
            clinin_id:request.body.clinin_id
        }})
        .then(result=>{
            response.status(200).json({message:"updated"});
        })
        .catch(error=>next(error));

}









