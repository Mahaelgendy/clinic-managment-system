const {request,response} = require("express");
const { Result } = require("express-validator");
const mongoose = require ("mongoose");

require("../Models/userModel");
require ("../Models/patientModel");

const userSchema = mongoose.model("users");
const patientSchema = mongoose.model("patients");

module.exports.getAllPatients = (request, response, next)=>{
    patientSchema.find().populate({path:'patientData',select:{fullName:1,age:1,gender:1}})
                        .then((data)=>{
                            response.status(200).json(data);
                        })
                        .catch((error)=>next(error));
};

module.exports.addPatient = (request, response, next)=>{
 userSchema.findOne({email:request.body.email})
            .then((data)=>{
                if(data!=null)
                {
                    let newPatient=new patientSchema({
                        status:request.body.patientStatus,
                        history:request.body.patientHistory,
                        height:request.body.patientHeight,
                        weight:request.body.patientWeight,
                        hasInsurance:request.body.patientHasInsurance,
                        phone:request.body.patientPhone
                
                    });
                    newPatient.save()
                    .then(result=>{
                        response.status(201).json({message:"added new patient is done"});
                    })
                    .catch(error=>next(error))
                }
                else
                {
                    response.status(404).json({message:"This Email does not exsist"})
                }

            })
            .catch(error=>next(error))
};

module.exports.updatePatient = (request, response, next)=>{
    patientSchema.findByIdAndUpdate({
        _id:request.params.id
    },
    {
        $set:{
            status:request.body.patientStatus,
            history:request.body.patientHistory,
            height:request.body.patientHeight,
            weight:request.body.patientWeight,
            hasInsurance:request.body.patientHasInsurance,
            phone:request.body.patientPhone,
        }
    }).then(result=>{
        response.status(200).json({message:"updated"});
    })
    .catch(error=>next(error))
};

module.exports.deletePatientById = (request, response, next)=>{
    patientSchema.findByIdAndDelete({_id:request.params.id})
        .then(()=>{
            response.status(200).json({message:"deleted"+request.params.id});
        })
        .catch((error)=>next(error));
};

module.exports.deletePatients = (request, response, next)=>{
    patientSchema.deleteMany({})
        .then((data)=>{
            response.status(200).json({message:"delete all patients"});
        })
        .catch((error)=>next(error));
};

module.exports.getPatientByID = (request, response, next)=>{
    patientSchema.findOne({_id:request.params.id})
                    .populate({path:"patientData"})
                    .then((data)=>{
                        response.status(200).json(data);
                    })
                    .catch((error)=>next(error));

};
