
const mongoose = require("mongoose");
require("./../Models/userModel");
const UserSchema = mongoose.model("users");
const { request, response } = require('express');

const bcrypt = require("bcrypt");
const saltRounds = 10;


exports.addUser = (request, response , next)=>{
    console.log(request.file)
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
        role:role,
        // image:request.file.path
    });

    user.save()
        .then(res=>{
            response.status(200).json({message:"User added"});
        })
        .catch(err=>next(err));
}

exports.getAllUsers = (request , response , next)=>{

    
    const query = {};
    if (request.query.fullName) query.fullName = request.query.fullName;
    if (request.query.id) query._id = mongoose.Types.ObjectId(request.query.id);
    if (request.query.role) query.role = request.query.role;
    if (request.query.email) query.email = request.query.email;

    let sortField = request.query.sort || 'fullName';
    
    UserSchema.find(query).sort({[sortField] :-1})
    .then(data=>{
        if(data!=null){
            response.status(200).json(data);
        }
    })
    .catch(error=>next(error));
};

exports.deleteUsers = (request , response , next)=>{
    try{
        const query = {};
        if (request.query.fullName) query.fullName = request.query.fullName;
        if (request.query.id) query._id = mongoose.Types.ObjectId(request.query.id);
        if (request.query.role) query.role = request.query.role;
        if (request.query.email) query.email = request.query.email;

        

        UserSchema.deleteMany(query)
        .then(data=>{
            if(data!=null){
                response.status(200).json({message:"User deleted"});
            }
        })
        .catch(error=>next(error));

    }catch(err){
        next(err)
    }
    
};

exports.updateUser = (request,response,next)=>{
    try{
        const query = {};
        if (request.query.fullName) query.fullName = request.query.fullName;
        if (request.query.id) query._id = mongoose.Types.ObjectId(request.query.id);
        if (request.query.email) query.email = request.query.email;

        const {fullName,password,email,age,gender,address,role} = request.body;


        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        UserSchema.updateOne({query},
            {$set:{
                fullName:fullName,
                password:hash,
                email:email,
                age:age,
                gender:gender,
                address:address,
                role:role,
                image:request.file.path
            }})
            .then(res=>{
                response.status(200).json({message:"User Updated"})
            })
            .catch(err=>next(err));
            
    }catch(error){
        next(error)
    }
    
}




