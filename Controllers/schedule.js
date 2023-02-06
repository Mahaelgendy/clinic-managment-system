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
            path: "doc_id", select: "userData", model: "doctors",
            populate: { path: "userData", select: "fullName", model: "users" }
        })
        .populate({ path: "clinic_id",select:" clinicName" })
        .then(data => {
            if (data != null) {
                response.status(200).json(data);

            } else {
                response.json({ message: "Schema not Found" });
            }
        })
        .catch((error) => next(error));
};

exports.getScheduleById = (request, response, next) => {

    SchedulaSchema.find({_id:request.params.id})
        .populate({
            path: "doc_id", select: "userData", model: "doctors",
            populate: { path: "userData", select: "fullName", model: "users" }
        })
        .populate({ path: "clinic_id",select:" clinicName" })
        .then(data => {
            if (data != null) {
                response.status(200).json(data);
            }
            else {
                response.json({ message: "Schema not Found" });
            }
        })
        .catch((error) => next(error));
};
exports.newSchedule = async(request, response, next) => {
    const doctorExist=await DoctorSchema.findOne({_id:request.body.doctor_id})
    const clinicExist=await clinicSchema.findOne({_id:request.body.clinic_id})

    if ((!doctorExist)||(!clinicExist)) {
        return response.status(400).json({message:"Check your data "})
    }
    
    const schedule = new SchedulaSchema({
        doc_id: request.body.doctor_id,
        clinic_id: request.body.clinic_id,
        date: request.body.date,
        from: dateTimeMW.getTimeFromString(request.body.from),
        to: dateTimeMW.getTimeFromString(request.body.to),
        duration_in_minutes: request.body.duration,
    })
    schedule.save()
        .then(result => { 
            response.status(201).json(result);
        })
        .catch(error => next(error));
};


exports.updateSchedule = (request, response, next) => {
    SchedulaSchema.updateOne({ _id: request.params.id},
        {
            $set: {
                clinic_id: request.body.clinic_Id,
                doc_id: request.body.doctor_Id,
                date: request.body.date,
                from: dateTimeMW.getTimeFromString(request.body.from),
                to: dateTimeMW.getTimeFromString(request.body.to),
                duration_in_minutes: request.body.duration,
            }
        }
    ).then(result => {
        if (result.modifiedCount == 1) {
            response.status(201).json({ message: "Schedule updated" })
        }
        else
            throw new Error("Schedule not found");
        })
        .catch(error => next(error));
}


exports.deleteSchedule = (request, response, next) => {
    SchedulaSchema.deleteOne({ _id: request.params.id})
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
