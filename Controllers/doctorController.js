
const bcrypt = require('bcrypt');
const saltRounds = 10;
const mongoose = require('mongoose');

require('./../Models/userModel');
require('./../Models/doctorModel');

const UserSchema = mongoose.model('users');
const DoctorSchema = mongoose.model('doctors')

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

    const {fullName,password,email,age,gender,address,role, specialization , price , schedules} = request.body;

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
        const doctor = new DoctorSchema({
            specialization:specialization,
            price:price,
            schedules:schedules,
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
        const doctor = await DoctorSchema.findById({_id:doctorId});
        const user = await doctor.findById(doctor.userData);
        await DoctorSchema.findByIdAndDelete({_id:doctorId})
        await UserSchema.findByIdAndDelete({_id:user._id});
        response.status(200).json({message:"Doctor deleted"});
    }catch(error){
        next(error)
    }
}

exports.updateDoctor = async (request , response , next)=>{
    try{
        const doctorId = request.params.id;
        const {fullName,password,email,age,address, specialization,price,schedules} = request.body;

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        const doctor = await DoctorSchema.findByIdAndUpdate({_id:doctorId},
            {$set:{
                specialization:specialization,
                price:price,
                schedules:schedules,
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

