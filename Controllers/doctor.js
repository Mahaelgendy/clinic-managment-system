

const { request, response } = require('express');
const mongoose = require('mongoose');

require('../Models/userModel');
require('../Models/doctorModel');

const UserSchema = mongoose.model('users');
const DoctorSchema = mongoose.model('doctors');
const SchedulaSchema= mongoose.model('schedules');

const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.getAllDoctors=(request , response , next)=>{
    DoctorSchema.find()
    .populate({path:'userData'})
    .then(data=>{
        response.status(200).json(data);
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
            response.json({message:"Id is not Found"});
        }
    })
    .catch(error=>next(error));
}

exports.addDoctor = async (request , response , next)=>{
    const emailExist = await UserSchema.findOne({email:request.body.email});

    if(emailExist){
        return response.status(400).json({message:"User is already exist"});
    }

    const {fullName,password,email,age,gender,address,role, specialization , price } = request.body;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const user = new UserSchema({
        fullName:fullName,
        password:hash,
        email:email,
        age:age,
        gender:gender,
        address:address,
        role:role,
        image:request.file.path
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
                            response.status(200).json({message:"Docor added"});
                    })
                    .catch(err=>{
                        UserSchema.deleteOne({email:email})
                        .then()
                        next(err)})
            }).catch(err=>next(err))
        
    }
}

exports.deleteDoctor = (request , response , next)=>{
    try{
        const doctorId = request.params.id;
        
        DoctorSchema.findById({_id:doctorId})
        .then(data=>{
            UserSchema.findByIdAndDelete({_id:data.userData})
            .then(()=>{
                SchedulaSchema.deleteMany({doc_id:doctorId})
                .then(()=>{
                    DoctorSchema.findByIdAndDelete({_id:doctorId})
                    .then(()=>{
                        response.status(200).json({message:"Doctor deleted"});
                    })
                })
                
            })
        }).catch(err=>next(err))
     
    }catch(error){
        next(error)
    }
}

//Update Doctor by id
exports.updateDoctor = async (request , response , next)=>{
    try{
        const doctorId = request.params.id;
        const {fullName,password,email,age,gender,address,role,specialization,price, image} = request.body;

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
                gender:gender,
                address:address,
                role:role,
                image:request.file.path
            }});

            response.status(200).json({message:"Doctor Updated"})
    }catch(error){
        next(error)
    }
}

