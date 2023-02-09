const {request , response} = require("express");
const { cookie } = require("express-validator");
const mongoose = require("mongoose");

require("../Models/PrescriptionModel");
require("../Models/userModel");
require("../Models/doctorModel");
require("../Models/patientModel")

const prescriptionSchema =  mongoose.model("prespictions");
const userSchema = mongoose.model("users");
const doctorSchema = mongoose.model("doctors");
const patientSchema = mongoose.model("patients")
const dateTimeMW = require("../Middlewares/dateTimeMW");
const prescriptionMW = require("../Middlewares/PrescriptionMW");


exports.getAllPrescriptions =async (request , response, next)=>{
    const query = prescriptionMW.getQueryToFindWith(request);
    console.log(request.role)
    if(request.role=="admin"){
        prescriptionSchema.find(query)
        .populate({path:"doctor_id", select:{"specialization":1, "price":1} ,populate:{path:"userData",select:{"fullName":1}}})
        .populate({path:"patient_id" ,populate:{path:"patientData", select:{"fullName":1}}})
        .populate({path:"medicine_id", select:{"medicineName":1}})
            .then(res=>{
                console.log("Autherized admin ");
                response.status(201).json(res)
            })
            .catch((error)=>next(error))
    }
    else if(request.role =="doctor"){
        const doctotid=await doctorSchema.findOne({userData:request.id},{_id:1});
        console.log(doctotid._id) 
        query.doctor_id =doctotid._id;
        console.log(query)
        prescriptionSchema.find(query)
        .populate({path:"doctor_id", select:{"specialization":1, "price":1} ,populate:{path:"userData",select:{"fullName":1}}})
        .populate({path:"patient_id" ,populate:{path:"patientData", select:{"fullName":1}}})
        .populate({path:"medicine_id", select:{"medicineName":1}})
            .then(res=>{
                if(res != null){
                    prescriptionMW.sortPrescription(res,request.query)
                    response.status(201).json(res)
                }
                else{
                    response.status(401).json("no data exist")
                }
            })
            .catch((error)=>next(error))
    }
    else if(request.role == "patient"){
        const patientid =await patientSchema.findOne({patientData:request.id});
        if(patientid == null){
            next(new Error({massage:"this patient not exist"}))
        }
        else{
            query.patient_id =patientid._id;
            prescriptionSchema.find(query)
            .populate({path:"doctor_id", select:{"specialization":1, "price":1} ,populate:{path:"userData",select:{"fullName":1, "role":1}}})
            .populate({path:"patient_id" ,populate:{path:"patientData", select:{"fullName":1}}})
            .populate({path:"medicine_id", select:{"medicineName":1}})
                .then(res=>{
                    if(res != null){
                        prescriptionMW.sortPrescription(res,request.query)
                        response.status(201).json(res)
                    }
                    else{
                        response.status(401).json("no data exist")
                    }
                })
                .catch((error)=>next(error))

        }
    }
}

exports.getPrescriptionById =async (request, response ,next)=>{
   await prescriptionSchema.findOne({_id:request.params.id})
    .populate({path:"doctor_id", select:{"_id":1,"specialization":1, "price":1} ,populate:{path:"userData",select:{"_id":1,"fullName":1, "role":1}}})
    .populate({path:"patient_id" ,populate:{path:"patientData", select:{"_id":1,"fullName":1}}})
    .populate({path:"medicine_id", select:{"medicineName":1}})
    .then(data => {
        if(data != null){
            if(data.patient_id.patientData!= null){
                if((data.doctor_id.userData._id == request.id) && (request.role =="doctor")){
                    response.status(201).json({data})
                }
                else if((data.patient_id.patientData._id == request.id) && (request.role =="patient")){
                    response.status(201).json({data})
                }
                else if ((request.role =="admin")){
                    response.status(201).json({data})
                }else{
                    response.status(201).json({"massage":"not Atherized"});
                }

            }
            else{
                response.status(404).json({message:"youn are not accecable on this ptrescription"})
            }
        }else {
            response.status(404).json({message:"Id is not exist"})
        }
    })
    .catch(error => next(error));
}

exports.addPrescription =async (request, response, next)=>{
    const doctor = await doctorSchema.findOne({userData: request.id});
    if(doctor._id == request.body.doctor_id){
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
    }else{
        response.status(201).json({"massage":"not Atherized"});
    }
}

exports.deleteAllPrescription = async (request , response ) =>{
    const query = prescriptionMW.getQueryToFindWith(request);
    if(request.role =="admin"){
        prescriptionSchema.deleteMany(query)
        .then(result=>{
            response.status(200).json({message:"Delete all prescription for doctor"});
        })
        .catch(error=> next(error));
    }
    else if(request.role=="doctor"){
        let doctor = await doctorSchema.findOne({"userData":request.id},{"_id":1,"userData":1});
        if(doctor != null){
            query.doctor_id = doctor._id;
            prescriptionSchema.deleteMany(query)
            .then(result=>{
                if(result != null){
                    response.status(200).json({message:"Delete all prescription for doctor"});
                }
                else{
                    response.status(200).json({message:"no prescriptions to be deleted"});
                }
            })
            .catch(error=> next(error));
        }
    }
}

exports.deletePrescriptionById = async (request , response ) =>{
    if(request.role =="admin"){
        prescriptionSchema.findByIdAndDelete({"_id":request.params.id})
        .then(result =>{
            console.log(result._id)
            if(result ==null){
                response.status(401).json({message:" not Found"});
            }else{
                response.status(200).json({message:"Delete  prescription from admin"});
            }
        })
        .catch(error=> next(error));
    }
    else if(request.role=="doctor"){
        let doctor = await doctorSchema.findOne({"userData":request.id},{"userData":1});
        if(doctor != null){
            prescriptionSchema.findOneAndDelete({"doctor_id":doctor._id , "_id":request.params.id})
            .then(result=>{
                if(result != null){
                    response.status(200).json({message:"Delete all prescription for doctor"});
                }
                else{
                    response.status(200).json({message:"prescription does not exist or you are not authorized"});
                }
            })
            .catch(error=> next(error));
        }
    }
}


exports.updatePrescription= (request,response , next)=>
{   
    prescriptionSchema.updateOne(
        {_id: request.params.id},
        {$set:{
            diagnosis:request.body.diagnosis,
            currentExamination:dateTimeMW.getDateFormat(new Date()),
            nextExamination:request.body.nextExamination,
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
            
        const patientname = request.params.name;
        const patient = await userSchema.findOne({"fullName":patientname , "role":"patient"}, {"_id":true , "fullName":true});    
        if(patient){
            await prescriptionSchema.findOne({_id:request.params.id})
            .populate({path:"doctor_id", select:{"_id":1,"specialization":1, "price":1} ,populate:{path:"userData",select:{"_id":1,"fullName":1, "role":1}}})
            .populate({path:"patient_id" ,populate:{path:"patientData", select:{"_id":1,"fullName":1}}})
            .populate({path:"medicine_id", select:{"medicineName":1}})
            .then(data => {
                if(data != null){
                    if(data.patient_id.patientData!= null){
                        if((data.doctor_id.userData._id == request.id) && (request.role =="doctor")){
                            response.status(201).json({data})
                        }
                        else if((data.patient_id.patientData._id == request.id) && (request.role =="patient")){
                            response.status(201).json({data})
                        }
                        else if ((request.role =="admin")){
                            response.status(201).json({data})
                        }else{
                            response.status(201).json({"massage":"not Atherized"});
                        }

                    }
                    else{
                        response.status(404).json({message:"youn are not accecable on this ptrescription"})
                    }
                }else {
                    response.status(404).json({message:"Id is not exist"})
                }
            })
            .catch(error => next(error))
}
}
