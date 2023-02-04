
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

exports.getDoctorById = (request , response , next)=>{
    DoctorSchema.findById({_id:request.params.id})
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

    const schedule = new SchedulaSchema({
        clinic_id:clinic_id,
        date:dateTimeMW.getDateFormat(new Date()),
        from:startTime,
        to: endTime,
        duration_in_minutes:duration
    });

    if(role ==='doctor'){
        const doctor = new DoctorSchema({
            specialization:specialization,
            price:price,
            doc_schedules:schedule._id,
            userData:user._id
        });

        doctor.save()
        .then(result=>{
            user.save()
                .then()
                .catch(err=>next(err));
            response.status(200).json({message:"Docor added"});
        })
        .catch(error=>next(error));
    }
}

exports.deleteDoctor = async (request , response , next)=>{
    try{
        const doctorId = request.params.id;
        
        const doctor = await DoctorSchema.find({_id:doctorId});
        console.log(doctor)
        // const user = await doctor.find({},{userData:1 , _id:0});
        // // const user = doctor.userData
        // console.log(user);

       
        UserSchema.findByIdAndDelete({_id:doctor.userData})
        .then(res=>{
            SchedulaSchema.deleteMany({doc_id:doctorId})
            .then(result=>{
                DoctorSchema.findByIdAndDelete({_id:doctorId})
                .then(result=>{
                    response.status(200).json({message:"Doctor deleted"});
                })
            })
            
        })
       

       

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

            response.status(200).json({message:"Doctor Updated"})
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
