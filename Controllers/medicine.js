
const { request, response } = require('express');
const mongoose = require('mongoose');
require('./../Models/medicineModel');
const MedicineSchema = mongoose.model('medicines');


exports.addMedicine = async(request,response , next)=>{
    const {name , company , speciality , description}= request.body;
    const medicineFound = await MedicineSchema.findOne({speciality:speciality , medicineName:name});
    if(medicineFound){
        return response.status(400).json({message:"Medicine is already exist"});
    }
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


const sortMedicine = (data,query)=>{
    let sortBy = query.sortBy||'name';
    let order = query.order ||"asc";
    let orderValue = order ==="asc"? 1:-1
    
    return data.sort((a,b)=>{
        if(a[sortBy]<b[sortBy]) return -1*orderValue;
        if(a[sortBy]>b[sortBy]) return 1*orderValue;
    });
};

exports.getAllMedicinces = (request , response , next)=>{
    const query = {};
    if (request.query.speciality) query.speciality = request.query.speciality;
    if (request.query.company) query.companyName = request.query.company;
    if (request.query.id) query._id = Number(request.query.id);
    if (request.query.name) query.medicineName = request.query.name;

    let sortField = request.query.sort || 'name';
    
    MedicineSchema.find(query)
    .then(data=>{
        if(data!=null){
            sortMedicine(data,request.query);
            response.status(200).json(data);
        }
    })
    .catch(error=>next(error));
};

exports.updateMedicines = (request,response,next)=>{
    try{
        const query = {};
        if (request.query.speciality) query.speciality = request.query.speciality;
        if (request.query.id) query._id = Number(request.query.id);
        if (request.query.name) query.medicineName = request.query.name;

        const {name , company , speciality , description}= request.body;

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
            
    }catch(error){
        next(error)
    }
    
}

exports.deleteMedicine = (request , response , next)=>{
    try{
        const query = {};
        if (request.query.speciality) query.speciality = request.query.speciality;
        if (request.query.id) query._id = Number(request.query.id);
        if (request.query.name) query.medicineName = request.query.name;

        MedicineSchema.deleteMany(query)
        .then(data=>{
            if(data!=null){
                response.status(200).json({message:"Medicine Deleted"});
            }
        })
        .catch(error=>next(error));

    }catch(err){
        next(err)
    }
    
};




