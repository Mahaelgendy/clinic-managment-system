
const { request, response } = require('express');
const mongoose = require('mongoose');
require('./../Models/medicineModel');
const MedicineSchema = mongoose.model('medicines');

//Post new medicine
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

exports.getAllMedicinces = (request , response , next)=>{
    const query = {};
    if (request.query.speciality) query.speciality = request.query.speciality;
    if (request.query.company) query.companyName = request.query.company;
    if (request.query.id) query._id = Number(request.query.id);
    if (request.query.name) query.medicineName = request.query.name;


    MedicineSchema.find(query).sort({name:1})
    .then(data=>{
        if(data!=null){
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







//===================================================================//
// //Get medicine by speciality and name
// exports.getMedicine = (request , response , next)=>{
//     const speciality = request.params.speciality;
//     const name = request.params.name;
//     MedicineSchema.find({speciality:speciality , medicineName:name})
//     .then(data=>{
//         if(data!=null){
//             response.status(200).json(data);
//         }else{
//             response.status(400).json({message:"No Medicines Found"});
//         }
//     }).catch(error=>next(error));
// }

// //Get all medicines by speciality
// exports.getAllMedicine = (request , response , next)=>{
//     const speciality = request.params.speciality;
//     MedicineSchema.find({speciality:speciality})
//     .then(data=>{
//         if(data!=null){
//             response.status(200).json(data);
//         }else{
//             response.status(400).json({message:"No Medicines Found in this Speciality"});
//         }
//     }).catch(error=>next(error));
// }

// //Get medicine by id
// exports.getMedicineById = (request , response , next)=>{
//     const id = request.params.id;
//     MedicineSchema.find({_id:id})
//     .then(data=>{
//         if(data!=null){
//             response.status(200).json(data);
//         }else{
//             response.status(400).json({message:"No Medicines Found"});
//         }
//     }).catch(error=>next(error));
// }


// //Update medicine by speciality and name
// exports.updateMedicine= async (request , response , next)=>{
//     try{
//         const specialityParam = request.params.speciality;
//         const nameParam = request.params.name;

//         const {name,company,speciality,description}= request.body;

//         MedicineSchema.updateOne({speciality:specialityParam , medicineName:nameParam},
//             {$set:{
//                 medicineName:name,
//                 companyName:company,
//                 speciality: speciality,
//                 description:description
//             }})
//             .then(res=>{
//                 response.status(200).json({message:"Medicine updated"});
//             })
//             .catch(err=>next(err));

//     }catch(error){
//         next(error)
//     }
    
// }

// //Update medicine by id
// exports.updateMedicineById = async(request , response , next)=>{
//     try{
//         const id = request.params.id;
//         const {name , company , speciality , description}= request.body;
//         MedicineSchema.findByIdAndUpdate({_id:id},
//             {$set:{
//                 medicineName:name,
//                 companyName:company,
//                 speciality: speciality,
//                 description:description
//             }})
//             .then(res=>{
//                 response.status(200).json({message:"Medicine updated"});
//             })
//             .catch(err=>next(err));

//     }catch(error){
//         next(error)
//     }

// }

// //Delete medicine by id
// exports.deleteMediciteById = (request , response , next)=>{
//     try{
//         const id = request.params.id
//         MedicineSchema.findByIdAndDelete({_id:id})
//         .then(result=>{
//             response.status(200).json({message:"Medicine Deleted"});
//         })
//         .catch(error=>next(error));

//     }catch(err){
//         next(err)
//     }
// }



