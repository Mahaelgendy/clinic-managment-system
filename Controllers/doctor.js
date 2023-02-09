

const { request, response } = require('express');
const mongoose = require('mongoose');

require('../Models/userModel');
require('../Models/doctorModel');
r
const UserSchema = mongoose.model('users');
const DoctorSchema = mongoose.model('doctors');
const SchedulaSchema= mongoose.model('schedules');

const bcrypt = require("bcrypt");
const saltRounds = 10;

const sortDoctor = (data,query)=>{
    let sortBy = query.sortBy||'price';
    let order = query.order ||"asc";
    let orderValue = order ==="asc"? 1:-1
    console.log(orderValue);

    if (sortBy=='fullName' || sortBy == 'fullname'){
        data.sort((a, b) => {
            if (a.userData.fullName < b.userData.fullName) {
                return -1*orderValue
            }
            if (a.userData.fullName > b.userData.fullName) {
                return 1*orderValue
            }
            return 0;
        });
    }
    else{
        return data.sort((a,b)=>{
            if(a[sortBy]<b[sortBy]) return -1*orderValue;
            if(a[sortBy]>b[sortBy]) return 1*orderValue;
    });
}

}

exports.getAllDoctors=(request , response , next)=>{

    const query = {};
    if (request.query.specialization) query.specialization = request.query.specialization;
    if (request.query.price) query.price = request.query.price;

    DoctorSchema.find(query)
    .populate({path:'userData'})
    .then(data=>{
        sortDoctor(data, request.query)
        response.status(200).json({data});
    })
    .catch(error=>next(error));
}

exports.getDoctorByEmail=(request , response , next)=>{
    const email = request.params.email;
    
    UserSchema.findOne({email:email})
    .then(data=>{
        DoctorSchema.findOne({userData:data._id})
        .populate({path:"userData"})
        .then(result=>{
            response.status(200).json(result);
        })
    })
    .catch(err=>next(err))
   

}

exports.getDoctorById = (request , response , next)=>{
    DoctorSchema.findById({_id:request.params.id})
    .populate({path:'userData'})
        .then(data => {
            if (data != null) {
                if (request.role == 'doctor' && (data.userData._id == request.id)) {
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
            else if(data == null) {
            response.json({message:"Id is not Found"});
        }
    })
    .catch(error=>next(error));
}


exports.addDoctor = async (request , response , next)=>{

    const emailExist = await UserSchema.findOne({email:request.body.email});
    
    if(emailExist){
        return response.status(400).json({message:"Email is already used"});
    }

    const diplicatName = await UserSchema.findOne({fullName:request.body.fullName , role:request.body.role})
    if(diplicatName){
        return response.status(400).json({message:"This name is already used, please choose another name"});
    }

    const {fullName,password,email,age,gender,address, specialization , price } = request.body;
    const role = 'doctor'
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
        image: request.file.path
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


exports.deleteDoctorById = (request , response , next)=>{
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


exports.updateDoctorById = async (request , response , next)=>{
    try{

        const emailExist = await UserSchema.findOne({email:request.body.email});
        if(emailExist){
            return response.status(400).json({message:"Email is already used"});
        }
        const duplicateName = await UserSchema.findOne({fullName:request.body.fullName})
        if(duplicateName){
            return response.status(400).json({message:"This name is already used, please choose another name"});
        }

        const doctorId = request.params.id;

        const {fullName,email,age,address,specialization,price} = request.body;


        const doctor = await DoctorSchema.findByIdAndUpdate({_id:doctorId},
            {$set:{
                specialization:specialization,
                price:price
            }});
            

        const user = await UserSchema.findByIdAndUpdate({_id:doctor.userData},
            {$set:{
                fullName:fullName,
                email:email,
                age:age,
                address:address,
                image:request.file.path
            }});

            response.status(200).json({message:"Doctor Updated"})
    }catch(error){
        next(error)
    }
}

exports.updateDoctorByEmail = async (request , response , next)=>{
    try{

        const emailExist = await UserSchema.findOne({email:request.body.email});
        if(emailExist){
            return response.status(400).json({message:"Email is already used"});
        }
        const duplicateName = await UserSchema.findOne({fullName:request.body.fullName})
        if(duplicateName){
            return response.status(400).json({message:"This name is already used, please choose another name"});
        }
        const emailparam = request.params.email;
        const {fullName,email,age,address,specialization,price} = request.body;
        
        const user = await UserSchema.findByIdAndUpdate({email:emailparam},
            {$set:{
                fullName:fullName,
                email:email,
                age:age,
                address:address,
                image:request.file.path
            }});

        const doctor = await DoctorSchema.findOneAndUpdate({userData:user._id},
            {$set:{
                specialization:specialization,
                price:price
            }});

            response.status(200).json({message:"Doctor Updated"})
    }catch(error){
        next(error)
    }
}



