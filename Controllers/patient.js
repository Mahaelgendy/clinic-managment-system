const {request,response} = require("express");
const { Result } = require("express-validator");
const mongoose = require ("mongoose");

require("../Models/userModel");
require ("../Models/patientModel");

const userSchema = mongoose.model("users");
const patientSchema = mongoose.model("patients");

// const sortPatients = (data,query)=>{
//     let sortBy = query.sortBy||'email';
//     let order = query.order ||"asc";
//     let orderValue = order ==="asc"? 1:-1

//     return data.sort((a,b)=>{
//         if(a[sortBy]<b[sortBy]) return -1*orderValue;
//         if(a[sortBy]>b[sortBy]) return 1*orderValue;
//     });
// }

const sortPatients = (data,query)=>{
    let sortBy = query.sortBy||'_id';
    let order = query.order ||"asc";
    let orderValue = order ==="asc"? 1:-1

    
    return data.sort((a,b)=>{
        if(a[sortBy]<b[sortBy]) return -1*orderValue;
        if(a[sortBy]>b[sortBy]) return 1*orderValue;
    });
};


module.exports.getAllPatients = async (request, response, next)=>{

    const query = {};
    if(request.query.status) query.status = request.query.status;
    if(request.query.height) query.height = Number(request.query.height);
    if(request.query.hasInsurance) query.hasInsurance = request.query.hasInsurance;
    if(request.query.patientId) query._id = Number(request.query.patientId);
    if(request.query.weight) query.weight = Number(request.query.weight);
    
    const page = request.query.page *1 || 1;
    const limit = request.query.limit *1 || 3;
    const skip =(page - 1) * limit;

    // let allPatients= await sortPatients(allPatients, request.query)

    patientSchema.find().populate({path:'patientData',select:{fullName:1,age:1,gender:1}}).skip(skip).limit(limit)
                        .then((data)=>{
                           let ptientsAfterSort = sortPatients(data,request.query)
                            response.status(200).json(ptientsAfterSort);
                        })
                        .catch((error)=>next(error)) ;
};


module.exports.addPatient = (request, response, next)=>{
 userSchema.findOne({email:request.body.email})
            .then((data)=>{
                if(data!=null && data.role === "patient")
                {
                    let newPatient=new patientSchema({
                        status:request.body.patientStatus,
                        history:request.body.patientHistory,
                        height:request.body.patientHeight,
                        weight:request.body.patientWeight,
                        hasInsurance:request.body.patientHasInsurance,
                        phone:request.body.patientPhone,
                        patientData:data._id
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
    const query = {};
    if(request.query.status) query.status = request.query.status;
    if(request.query.height) query.height = Number(request.query.height);
    if(request.query.hasInsurance) query.hasInsurance = request.query.hasInsurance;
    if(request.query.patientId) query._id = Number(request.query.patientId);
    if(request.query.weight) query.weight = Number(request.query.weight);

    patientSchema.deleteMany(query)
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
