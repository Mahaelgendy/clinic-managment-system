
const mongoose = require("mongoose");
require("./../Models/userModel");
const UserSchema = mongoose.model("users");
const { request, response } = require('express');

const bcrypt = require("bcrypt");
const saltRounds = 10;

const sortUsers = (data,query)=>{
    let sortBy = query.sortBy||'fullName';
    let order = query.order ||"asc";
    let orderValue = order ==="asc"? 1:-1

    
    return data.sort((a,b)=>{
        if(a[sortBy]<b[sortBy]) return -1*orderValue;
        if(a[sortBy]>b[sortBy]) return 1*orderValue;
    });
};
exports.addUser = async (request, response , next)=>{

    const emailExist = await UserSchema.findOne({email:request.body.email});
    if(emailExist){
        return response.status(400).json({message:"User is already exist"});
    }
    const diplicatName = await UserSchema.findOne({fullName:request.body.fullName , role:request.body.role})
    if(diplicatName){
        return response.status(400).json({message:"This name is already used, please choose another name"});
    }

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
        image:request.file.filename
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
    
    UserSchema.find(query)
    .then(data=>{
        if(data!=null){
            userAfterSort= sortUsers(data, request.query)
            response.status(200).json({userAfterSort});
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
                image:request.file.filename
            }})
            .then(res=>{
                response.status(200).json({message:"User Updated"})
            })
            .catch(err=>next(err));
            
    }catch(error){
        next(error)
    }
    
}




