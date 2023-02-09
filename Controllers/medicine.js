
const { request, response } = require('express');
const mongoose = require('mongoose');
require('./../Models/medicineModel');
require ("../Models/userModel");
require("../Models/doctorModel")
const MedicineSchema = mongoose.model('medicines');
const usersSchema = mongoose.model('users');
const doctorSchema = mongoose.model('doctors')
exports.addMedicine = async(request,response , next)=>{
    const {name , company , speciality , description}= request.body;
    const medicineFound = await MedicineSchema.findOne({speciality:speciality , medicineName:name});
    if(medicineFound){
       return response.status(400).json({message:"Medicine is already exist"});
    }
    const doctorspeciality = await doctorSchema.findOne({specialization:speciality , userData:request.id})
    usersSchema.findOne({_id:request.id})
        .then((data)=>{
            if(data.role == "doctor"){
                if(speciality ==doctorspeciality.specialization ){
                    console.log("doctor")
                    const newMedicine = new MedicineSchema({
                        medicineName:name,
                        companyName:company,
                        speciality:doctorspeciality.specialization,
                        description:description
                    });
                    newMedicine.save()
                            .then(data=>{
                                response.status(200).json({message:"Medicine Added"});
                            })
                            .catch(error=>next(error));
                }
                else{
                    return response.status(401).json({message:"specializaation does not match"}); 
                }
            }
            else if(data.role =="admin"){
                console.log("admin")
                    const newMedicine = new MedicineSchema({
                    medicineName:name,
                    companyName:company,
                    speciality: speciality,
                    description:description
                    });
                    newMedicine.save()
                            .then(data=>{
                                response.status(200).json({message:"Medicine Added"});
                            })
                            .catch(error=>next(error));
            }
            else{
                console.log("you are not authrized")
            }
        })
        .catch(err =>
            console.log("error"))

}


const sortMedicine = (data,query)=>{
    let sortBy = query.sortBy||'name';
    let order = query.order ||"asc";
    let orderValue = order ==="asc"? 1:-1
    
    return data.sort((a,b)=>{
        if(a[sortBy]<b[sortBy]) return -1*orderValue;
        if(a[sortBy]>b[sortBy]) return 1*orderValue;
    });
};

exports.getAllMedicinces =async (request , response , next)=>{
    const query = {};
    if (request.query.speciality) query.speciality = request.query.speciality;
    if (request.query.company) query.companyName = request.query.company;
    if (request.query.id) query._id = Number(request.query.id);
    if (request.query.name) query.medicineName = request.query.name;
    let sortField = request.query.sort || 'name';
    console.log(query)
    if(request.role =="admin"){
        MedicineSchema.find(query)
        .then(data=>{
            if(data!=null){
                sortMedicine(data,request.query);
                response.status(200).json(data);
            }
        })
        .catch(error=>next(error));
    }
    else if(request.role == "doctor"){
        const doctorspeciality = await doctorSchema.findOne({ userData:request.id})
        MedicineSchema.find({speciality:doctorspeciality.specialization})
        .then(data=>{
            if(data!=null){
                console.log(data)
                sortMedicine(data,request.query);
                response.status(200).json(data);
            }
        })
        .catch(error=>next(error));
    }
};

exports.updateMedicines =async (request,response,next)=>{
    try{
        const query = {};
        if (request.query.speciality) query.speciality = request.query.speciality;
        if (request.query.id) query._id = Number(request.query.id);
        if (request.query.name) query.medicineName = request.query.name;

        const {name , company , speciality , description}= request.body;

        if(request.role =="admin"){
            MedicineSchema.updateOne({query},
                {$set:{
                    medicineName:name,
                    companyName:company,
                    speciality: speciality,
                    description:description
                }})
                .then(res=>{
                    response.status(200).json({message:"Medicine updated"});
                })
                .catch(err=>next(err));
        }
        else if(request.role == "doctor"){
            const doctorspeciality = await doctorSchema.findOne({ userData:request.id})
            MedicineSchema.updateOne({speciality:doctorspeciality.specialization},
                {$set:{
                    medicineName:name,
                    companyName:company,
                    speciality: doctorspeciality.specialization,
                    description:description
                }})
                .then(res=>{
                    response.status(200).json({message:"Medicine updated"});
                })
                .catch(err=>next(err));
        
        }
    }catch(error){
        next(error)
    }
}

exports.deleteMedicine =async (request , response , next)=>{
    try{
        const query = {};
        if (request.query.speciality) query.speciality = request.query.speciality;
        if (request.query.id) query._id = Number(request.query.id);
        if (request.query.name) query.medicineName = request.query.name;

        if(request.role =="admin"){
           await MedicineSchema.deleteMany({query})
                .then(res=>{
                    response.status(200).json({message:"Medicine deleted"});
                })
                .catch(err=>next(err));
        }
        else if(request.role == "doctor"){
            const doctorspeciality = await doctorSchema.findOne({ userData:request.id})
            query.speciality = doctorspeciality.specialization;
            console.log(query);
            MedicineSchema.deleteMany(query)
                .then(res=>{
                    response.status(200).json({message:"Medicine deleted for specialization"});
                })
                .catch(err=>next(err));
        
        }
    }catch(error){
        next(error)
    }
    
};




