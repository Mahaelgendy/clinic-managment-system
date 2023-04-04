const {request,response} = require("express");
const { Result } = require("express-validator");
const mongoose = require ("mongoose");

require("../Models/userModel");
require ("../Models/patientModel");

const userSchema = mongoose.model("users");
const patientSchema = mongoose.model("patients");

const sortPatients = (data,query)=>{
    let sortBy = query.sortBy||'_id';
    let order = query.order ||"asc";
    let orderValue = order ==="asc"? 1:-1

    if (sortBy=='fullName' || sortBy == 'fullname'){
        data.sort((a, b) => {
            if (a.userData.fullName < b.userData.fullName) {
                return -1*  orderValue
            }
            if (a.userData.fullName > b.userData.fullName) {
                return 1*  orderValue
            }
            return 0;
        });
    }
    
    else
    {    
        return data.sort((a,b)=>{
            if(a[sortBy]<b[sortBy]) return -1*orderValue;
            if(a[sortBy]>b[sortBy]) return 1*orderValue;
        });
    }
};


module.exports.getAllPatients = async (request, response, next)=>{

    const query = {};
    if(request.query.status) query.status = request.query.status;
    if(request.query.height) query.height = Number(request.query.height);
    if(request.query.hasInsurance) query.hasInsurance = request.query.hasInsurance;
    if(request.query.patientId) query._id = Number(request.query.patientId);
    if(request.query.weight) query.weight = Number(request.query.weight);
    if(request.query.patientData) query.patientData =request.query.patientData;
    
    const page = request.query.page *1 || 1;
    const limit = request.query.limit *1 || 3;
    const skip =(page - 1) * limit;


    patientSchema.find(query).populate({path:'patientData',select:{fullName:1,age:1,gender:1}}).skip(skip).limit(limit)
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
                        status:request.body.status,
                        history:request.body.history,
                        height:request.body.height,
                        weight:request.body.weight,
                        hasInsurance:request.body.hasInsurance,
                        phone:request.body.phone,
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
            status:request.body.status,
            history:request.body.history,
            height:request.body.height,
            weight:request.body.weight,
            hasInsurance:request.body.hasInsurance,
            phone:request.body.phone,
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
                        if (data != null) {
                            console.log(data.patientData._id)
                            if (request.role == 'patient' && (data.patientData._id == request.id)) {
                                console.log("true, patient")
                                response.status(200).json(data);
                            }
                             if (request.role == 'doctor') {
                                console.log("true, doctor")
                                response.status(200).json(data);
                            }
                            else if (request.role == 'admin') {
                                console.log("true, admin")
                                response.status(200).json(data);
                            }
                            else{
                                response.json({message:"You aren't authourized to see this data"});
                            }
                        }
                        else  {
                        response.json({message:"Id is not Found"});
                    }
                    })
                    .catch((error)=>next(error));

};

module.exports.getPatientByEmail = (request, response, next)=>{
    const email = request.params.email;

    userSchema.findOne({email:email})
                .then((userData)=>{
                    patientSchema.findOne({patientData:userData._id})
                    .populate({path:"patientData"})
                    .then((data)=>{
                        response.status(200).json(data);
                    })
                })
                 .catch((error)=>next(error));
};


module.exports.getPatientByName = (request, response , next)=>{
    const fullName = request.params.fullName;
    console.log("Hello")
    userSchema.findOne({fullName:fullName})
    .then(res=>{
        console.log(res);
        patientSchema.findOne({patientData:res._id})
        .populate({path:"patientData"})
            .then((data)=>{
                response.status(200).json(data);
            })
    })
    .catch(err=>next(err))
}
