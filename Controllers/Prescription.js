const {request , response} = require("express");
const mongoose = require("mongoose");
require("../Models/PrescriptionModel");
const prescriptionSchema =  mongoose.model("prespictions");
const dateTimeMW = require("../Middlewares/dateTimeMW")
exports.getAllPrescriptions = (request , response, next)=>{

    prescriptionSchema.find()
    .populate({path:"doctor_id" })
    .populate({path:"patient_id"})
    .populate({path:"medicine_id"})
    .then(data=>{
        response.status(201).json(data)
    })
    .catch(error=>next(error));
}

exports.getPrescriptionById = (request, response ,next)=>{
    
    prescriptionSchema.findOne({_id:request.params.id})
    .populate({path:"doctor_id"})
    .populate({path:"patient_id"})
    .populate({path:"medicine_id"})
    .then(data => {
        if(data != null){
            response.status(201).json({data})
        }else {
            response.status(404).json({message:"Id is not exist"})
        }
    })
    .catch(error => next(error));
}
exports.addPrescription =(request, response, next)=>{
    let newPrescription = new prescriptionSchema({
        diagnosis:request.body.diagnosis,
        currentExamination:dateTimeMW.getDateFormat(new Date()),
        nextExamination:request.body.nextExamination,
        doctor_id:request.body.doctor_id,
        patient_id:request.body.patient_id,
        medicine_id:request.body.medicine_id
    });
    newPrescription.save()
        .then(result =>{
            response.status(201).json({Message:"new prescription Added"});
        })
        .catch(error => next(error));
}

exports.deletePrescriptionById=(request, response,next)=>
{
    prescriptionSchema.findByIdAndDelete({_id:request.params.id})
    .then(result=>{
        response.status(200).json({message:"Delete with id "+request.params.id});
    })
    .catch(error=>next(error));
}

exports.updatePrescription= (request,response , next)=>
{
    prescriptionSchema.updateOne(
        {_id: request.params.id},
        {$set:{
            diagnosis:request.body.diagnosis,
            currentExamination:dateTimeMW.getDateFormat(new Date()),
            nextExamination:request.body.nextExamination,
            doctor_id:request.body.clinic_location,
            patient_id:request.body.clinic_id,
            medicine_id:request.body.medicine_id
        }})
        .then(result=>{
            response.status(200).json({message:"updated"});
        })
        .catch(error=>next(error));

}









