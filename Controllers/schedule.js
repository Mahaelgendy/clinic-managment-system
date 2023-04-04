const { request, response } = require('express');
const mongoose = require('mongoose');

const dateTimeMW = require("../middlewares/dateTimeMW");
require('../Models/doctorModel');
const SchedulaSchema= mongoose.model('schedules');
const DoctorSchema = mongoose.model('doctors');
const clinicSchema= mongoose.model('clinics');

exports.getAllSchedules = (request, response, next) => {

    const query = {};
    if (request.query.clinicId) query.clinic_id = Number(request.query.clinicId);
    if (request.query.doctorId) query.doc_id = Number(request.query.doctorId);
    if (request.query.date) query.date = request.query.date;

   
        SchedulaSchema.find(query)
        .populate({
            path: 'doc_id',
            select: 'userData',
            model: 'doctors',
            populate: {path: 'userData', select: 'fullName', model: 'users'}
        })
        .populate({ path: "clinic_id", select: " clinicName" })

        .then(data => {
                // if(request.role == 'doctor'){
                //     const filteredData = data.filter(schedule => {
                //     return schedule.doc_id.userData._id.toString() === request.id;})
                //     //invoiceMW.sortInvoice(filteredData,request.query);
                //     response.status(200).json(filteredData);
                // }
                // else if (request.role == 'admin') {
                //     console.log("true, admin")
                    response.status(200).json(data);
                // }
                // else{
                //     response.json({message:"You aren't authourized to see this data"});
                // }
            })
         .catch((error) => next(error));

};

exports.getScheduleById = (request, response, next) => {

    SchedulaSchema.findOne({_id:request.params.id})
        .populate({
            path: "doc_id", select: { userData:1,_id:0}, model: "doctors",
            populate: { path: "userData", select: { fullName:1,_id:1 }, model: "users" }
        })
        .populate({ path: "clinic_id",select:" clinicName" })
        .then(data => {
            if (data != null) {
                if ((request.role == 'doctor') &&(data.doc_id.userData._id==request.id)) {
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
        .catch((error) => next(error));
};

exports.newSchedule = async(request, response, next) => {
    const doctorExist=await DoctorSchema.findOne({_id:request.body.doc_id})
    const clinicExist=await clinicSchema.findOne({_id:request.body.clinic_id})

    if ((!doctorExist)||(!clinicExist)) {
        return response.status(400).json({message:"Check your data "})
    }
    
    const schedule = new SchedulaSchema({
        doc_id: request.body.doc_id,
        clinic_id: request.body.clinic_id,
        date: request.body.date,
        from: dateTimeMW.getTimeFromString(request.body.from),
        to: dateTimeMW.getTimeFromString(request.body.to),
        duration_in_minutes: request.body.duration_in_minutes,
    })
    schedule.save()
        .then(result => { 
            response.status(201).json(result);
        })
        .catch(error => next(error));
};


exports.updateSchedule = async (request, response, next) => {
    if (request.role == 'doctor') {
        console.log("true, doctor")
        await DoctorSchema.findOne({ "userData": request.id })
        .then(data => {
            let DOCID = data._id
            
            SchedulaSchema.updateOne({
                    _id: request.params.id,
                     doc_id:DOCID 
                },
                    {
                        $set: {
                            clinic_id: request.body.clinic_Id,
                            date: request.body.date,
                            from: dateTimeMW.getTimeFromString(request.body.from),
                            to: dateTimeMW.getTimeFromString(request.body.to),
                            duration_in_minutes: request.body.duration,
                        }
                    }
                ).then(result => {
                    console.log(result)
                   
                    if (result.modifiedCount==1) {
                        response.status(201).json({ message: "Schedule updated" })
                    }
                    else if (result.modifiedCount==0) {
                        response.status(201).json({ message: "You haven't changed any data" })
                    }
                    else
                        throw new Error("Schedule not found");
                    })
                .catch(error => next(error));

        })
        .catch(err => {
            throw new Error("doctor not found");
    })
    }
    
    else if (request.role == 'admin') {
        console.log("true, admin")
        SchedulaSchema.updateOne({
            _id: request.params.id,
        },
            {
                $set: {
                    doc_id: request.body.doc_id,
                    clinic_id: request.body.clinic_Id,
                    date: request.body.date,
                    from: dateTimeMW.getTimeFromString(request.body.from),
                    to: dateTimeMW.getTimeFromString(request.body.to),
                    duration_in_minutes: request.body.duration_in_minutes,
                }
            }
        ).then(result => {
            console.log(result)
           
            if (result.modifiedCount==1) {
                response.status(201).json({ message: "Schedule updated" })
            }
           else if (result.modifiedCount==0) {
                response.status(201).json({ message: "You haven't changed any data" })
            }
            else
                throw new Error("Schedule not found");
            })
        .catch(error => next(error));
    }

}

exports.deleteScheduleById =async (request, response, next) => {
    if (request.role == 'doctor') {
        await DoctorSchema.findOne({ "userData": request.id })
            .then(data => {

                let DOCID = data._id

                SchedulaSchema.deleteOne({ _id: request.params.id, doc_id: DOCID })
                    .then((result) => {
                        if (result.deletedCount == 1) {
                            response.status(201).json({ message: " Schedule deleted" })
                        }
                        else
                            throw new Error("Schedule not found");
                    })
                    .catch((error) => next(error));
            })
            .catch(err => {
                throw new Error("doctor not found");
            })
    }
    else if (request.role == 'admin') {
        SchedulaSchema.deleteOne({ _id: request.params.id})
        .then((result) => {
            if (result.deletedCount == 1) {
                response.status(201).json({ message: " Schedule deleted" })
            }
            else
                throw new Error("Schedule not found");
        })
        .catch((error) => next(error));
    }
   
};

exports.deleteScheduleByFilter = (request, response, next) => {
    const query = {};
    if (request.query.clinicId) query.clinic_id = Number(request.query.clinicId);
    if (request.query.doctorId) query.doc_id = Number(request.query.doctorId);
    if (request.query.date) query.date = request.query.date;

    SchedulaSchema.deleteOne(query)
        .then((result) => {
            if (result.deletedCount == 1) {
                response.status(201).json({ message: " Schedule deleted" })
            }
            else
                throw new Error("Schedule not found");
        })
        .catch((error) => next(error));
};

// exports.getScheduleByDoctorId = (request, response, next) => {
//     SchedulaSchema.find({ doctor_id: request.body.id })
//         .populate({ path: "doc_id" })
//         .then(data => {
//             if (data != null) {
//                 response.status(200).json(data);

//             } else {
//                 response.json({ message: "Doctor Id not Found" });
//             }
//         })
//         .catch((error) => next(error));
// };

// exports.getScheduleByClinicId = (request, response, next) => {
//     SchedulaSchema.find({clinic_id: request.body.id })
//         .populate({ path: "doc_id" })
//         .populate({ path: "clinic_id" })

//         .then(data => {
//             if (data != null) {
//                 response.status(200).json(data);

//             } else {
//                 response.json({ message: "Clinic Id not Found" });
//             }
//         })
//         .catch((error) => next(error));
// };
