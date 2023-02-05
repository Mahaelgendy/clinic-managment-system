const {request , response} = require("express");
const mongoose = require("mongoose");
require("../Models/PrescriptionModel");
require("../Models/userModel");
const prescriptionSchema =  mongoose.model("prespictions");
const userSchema = mongoose.model("users");
const dateTimeMW = require("../Middlewares/dateTimeMW")


exports.getAllPrescriptions = (request , response, next)=>{

    const query ={};
    if(request.query.diagnosis)
        query.diagnosis = request.query.diagnosis
    if(request.query.currentExamination)
        query.currentExamination = request.query.currentExamination
    if(request.query.doctor_id)
        query.doctor_id = request.query.doctor_id
    if(request.query.patient_id)
        query.patient_id = request.query.patient_id

    prescriptionSchema.find()
    .populate({path:"doctor_id", select:{"_id":0,"specialization":1, "price":1} ,populate:{path:"userData",select:{"_id":0,"fullName":1}}})
    .populate({path:"patient_id" ,populate:{path:"patientData", select:{"_id":0,"fullName":1}}})
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

exports.deleteAllPrescription = (request , response ) =>{
    prescriptionSchema.deleteMany()
    .then(result=>{
        response.status(200).json({message:"Delete all prescription"});
    })
    .catch(error=>next(error));
}

// exports.deletePrescriptionById=(request, response,next)=>
// {
//     prescriptionSchema.findByIdAndDelete({_id:request.params.id})
//     .then(result=>{
//         response.status(200).json({message:"Delete with id "+request.params.id});
//     })
//     .catch(error=>next(error));
// }

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

exports.addPrescriptionByPatient = async (request, response , next) =>{
    try{
        const doctorName = request.params.name;
        const patientname = request.params.pname;
        const doctor = await userSchema.findOne({"fullName":doctorName, "role":"doctor"},{"_id":true,"fullName":true })
        const patient = await userSchema.findOne({"fullName":patientname , "role":"patient"}, {"_id":true , "fullName":true});    
        
        if(doctor && patient){
            let newPrescription = new prescriptionSchema({
                diagnosis:request.body.diagnosis,
                currentExamination:dateTimeMW.getDateFormat(new Date()),
                nextExamination:request.body.nextExamination,
                doctor_id:doctor._id,
                patient_id:request.params.id,
                medicine_id:request.body.medicine_id
            });
            newPrescription.save()
                .then(result =>{
                    response.status(201).json({Message:"new prescription Added"});
                })
                .catch(error => next(error));
        }
    }catch(error){
    next(error)
    }

}

exports.getAllPrescriptionsForPatient = async (request, response , next)=>{
    try{
        const patientname = request.params.name;
        const patient = await userSchema.findOne({"fullName":patientname , "role":"patient"}, {"_id":true , "fullName":true});    
        if(patient){
            prescriptionSchema.find()
                .populate({path : "patient"})
                .then(data =>{
                    response.status(201).json(data)
                })
                .catch(error => next(error));
        }
    }catch{
        next(error);
    }
    
}
