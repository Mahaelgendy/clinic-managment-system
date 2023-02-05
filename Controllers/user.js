
const mongoose = require("mongoose");
require("./../Models/userModel");
const UserSchema = mongoose.model("users");
const { request, response } = require('express');
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.getAllUsers = (request , response , next)=>{
    UserSchema.find()
        .then(data=>{
            if(data!=null){
                response.status(200).json(data);
            }
        })
        .catch(error=>next(error));

}

exports.getAllUsersByRole = (request , response , next)=>{
    const role = request.param.role
    UserSchema.find({role:role})
    .then(data=>{
        if(data!=null){
            response.status(200).json(data);
        }else{
            response.status(200).json({message:"No Data for this role"})
        }
    })
    .catch(error=>next(error));
}

exports.getUserById = (request , response , next)=>{
    const id = request.param.id;
    UserSchema.findById({_id:id})
    .then(data=>{
        if(data!=null){
            response.status(200).json(data);
        }else{
            response.status(200).json({message:"Id is not found"})
        }
    })
    .catch(error=>next(error));
}

exports.getUserByEmail = (request , response , next)=>{
    const email = request.param.email;
    UserSchema.find({email:email})
    .then(data=>{
        if(data!=null){
            response.status(200).json(data);
        }else{
            response.status(200).json({message:"Email is not found"})
        }
    })
    .catch(error=>next(error));
}

exports.getUserByName = (request , response , next)=>{
    const name = request.param.name;
    UserSchema.find({fullName:name})
    .then(data=>{
        if(data!=null){
            response.status(200).json(data);
        }else{
            response.status(200).json({message:"Name is not found"})
        }
    })
    .catch(error=>next(error));
}

exports.addUser = (request, response , next)=>{
    const {fullName,password,email,age,gender,address,role} = request.body;

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

    user.save()
        .then(res=>{
            response.status(200).json({message:"User added"});
        })
        .catch(err=>next(err));
}

exports.deleteUserById = (request , response , next)=>{
    try{
        const id = request.param.id;
        UserSchema.findByIdAndDelete({_id:id})
        .then(res=>{
            response.status(200).json({message:"User deleted"});
        })
        .catch(err=>next(err));
        
    }catch(error){
        next(error)
    }
    
}



