

const { request, response } = require('express');
const mongoose = require('mongoose');

require('../Models/userModel');
require('../Models/doctorModel');

const UserSchema = mongoose.model('users');
const DoctorSchema = mongoose.model('doctors');
const SchedulaSchema= mongoose.model('schedules');

const bcrypt = require("bcrypt");
const saltRounds = 10;

// const sortDoctor = (data,query)=>{
//     // let sortBy = 'fullName';

//     // if (sortBy=='fullName' || sortBy == 'fullname'){
//     //     data.sort((a, b) => {
//     //         if (a.userData.fullName < b.userData.fullName) {
//     //             return 1;
//     //         }
//     //         if (a.userData.fullName > b.userData.fullName) {
//     //             return -1;
//     //         }
//     //         return 0;
//     //     });
//     // }
//     // else{
//     //     return data.sort((a,b)=>{
//     //         if(a[sortBy]<b[sortBy]) return -1*orderValue;
//     //         if(a[sortBy]>b[sortBy]) return 1*orderValue;
//     //     });
//     // }



//     // let sortBy = query.sortBy||'fullName';
//     // let order = query.order ||"asc";
//     // let orderValue = order ==="asc"? 1:-1

    
//     // return data.sort((a,b)=>{
//     //     if(a.userData.sortBy<b.userData.sortBy) return -1*orderValue;
//     //     if(a.userData.sortBy>b.userData.sortBy) return 1*orderValue;
//     // });
// };

const sortDoctor = (data,query)=>{
    let sortBy = query.sortBy||'date';
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
    if (request.query.fullName) query.fullName = request.query.fullName;
    if (request.query.email) query.email = request.query.email;

    let mydata = [];

    UserSchema.find({role:"doctor"})
    .then(data=>{
        for(let i=0; i<data.length; i++){
            let id = data[i]._id;
            // console.log(id)
            DoctorSchema.find({userData:id},{_id:0})
            .populate({path:"userData"})
            .then(result=>{
                // console.log(result)
                mydata[i] = result
                response.data = result
                // response.status(200).json(result);
            })
            console.log(response.data);
        }
    }).catch(error=>next(error));


    DoctorSchema.find(query)
    .populate({path:'userData'})
    .then(data=>{
        sortDoctor(data, request.query)
        response.status(200).json({data});
        // response.status(200).json(data);
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

    const diplicatName = await UserSchema.findOne({fullName:request.body.fullName , role:request.body.role})
    if(diplicatName){
        return response.status(400).json({message:"This name is already used, please choose another name"});
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
        image:request.file.filename
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
        const {fullName,password,email,gender,age,address,specialization,price} = request.body;

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
                image:request.file.filename
            }});

            response.status(200).json({message:"Doctor Updated"})
    }catch(error){
        next(error)
    }
}

