
const bcrypt = require('bcrypt');
const { request, response } = require('express');
const saltRounds = 10;
const mongoose = require('mongoose');

require('../Models/userModel');
require('../Models/doctorModel');

const UserSchema = mongoose.model('users');
const DoctorSchema = mongoose.model('doctors');
const SchedulaSchema= mongoose.model('schedules');
const dateTimeMW = require("../middlewares/dateTimeMW");

exports.getAllDoctors=(request , response , next)=>{
    DoctorSchema.find()
    .populate({path:'userData'})
    .then(data=>{
        if(data!=null){
            response.status(200).json(data);
        }else{
            next(new Error({message:"Id is not exist"}))
        }
    })
    .catch(error=>next(error));
}

exports.getDoctorById = (request , response , next)=>{
    DoctorSchema.findById({_id:request.params.id})
    .populate({path:'userData'})
    .populate({path:'doc_schedules'})
    .then(data=>{
        if(data!=null){
            response.status(200).json(data);
        }else{
            next(new Error({message:"Id is not exist"}))
        }
    })
    .catch(error=>next(error));
}

exports.addDoctor = async (request , response , next)=>{
    const emailExist = await UserSchema.findOne({email:request.body.email});

    if(emailExist){
        return response.status(400).json({message:"User is already exist"});
    }

    const {fullName,password,email,age,gender,address,role, specialization , price , 
        clinic_id ,startTime,endTime,duration} = request.body;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const user = new UserSchema({
        fullName:fullName,
        password:hash,
        email:email,
        age:age,
        gender:gender,
        address:address,
        role:role
    });
    
   
    if(role ==='doctor'){

        user.save()
            .then(result=>{
                const doctor = new DoctorSchema({
                    specialization:specialization,
                    price:price,
                    userData:result._id
                });
                
                doctor.save()
                    .then(res=>{
                        const schedule = new SchedulaSchema({
                            clinic_id:clinic_id,
                            doc_id:res._id,
                            date:dateTimeMW.getDateFormat(new Date()),
                            from:dateTimeMW.getTimeFromString(startTime),
                            to: dateTimeMW.getTimeFromString(endTime),
                            duration_in_minutes:duration
                        });
                        
                        schedule.save()
                        .then(resu=>{
                            response.status(200).json({message:"Docor added"});
                        })
                        .catch(err=>next(err))
                    })
                    .catch(err=>next(err))
            }).catch(err=>next(err))
        
    }
}

exports.deleteDoctor = async (request , response , next)=>{
    try{
        const doctorId = request.params.id;
        
        const doctor = await DoctorSchema.findById({_id:doctorId});
        const user = await doctor.findById({userData:doctor.userData});

        await DoctorSchema.findByIdAndDelete({_id:doctorId});
        await UserSchema.findByIdAndDelete({_id:user._id});
        await SchedulaSchema.deleteMany({doc_id:doctorId});

        response.status(200).json({message:"Doctor deleted"});

    }catch(error){
        next(error)
    }
}

exports.updateDoctor = async (request , response , next)=>{
    try{
        const doctorId = request.params.id;
        const {fullName,password,email,age,address, specialization,price} = request.body;

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        const doctor = await DoctorSchema.findByIdAndUpdate({_id:doctorId},
            {$set:{
                specialization:specialization,
                price:price
            }});
            
        const user = await UserSchema.findByIdAndUpdate({_id:doctor.userData},
            {$set:{
                fullName:fullName,
                password:hash,
                email:email,
                age:age,
                address:address,
            }});

            response.status(200).json({message:"Doctor apdated"})
    }catch(error){
        next(error)
    }
}

exports.updateSchedule =(request , response , next)=>{
    try{
        const {docId,scheduleId,clinic_id ,startTime,endTime,duration} = request.body;

        SchedulaSchema.findOneAndUpdate({_id:scheduleId,doc_id:docId},
            {$set:{
                clinic_id:clinic_id,
                date:dateTimeMW.getDateFormat(new Date()),
                from:dateTimeMW.getTimeFromString(startTime),
                to: endTime,
                duration_in_minutes:duration
            }});
        
        response.status(200).json({message:"Schedule updated"});

    }catch(error){
        next(error)
    }
}

