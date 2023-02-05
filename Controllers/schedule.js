const { request, response } = require('express');
const mongoose = require('mongoose');

require('../Models/doctorModel');
const SchedulaSchema= mongoose.model('schedules');
const dateTimeMW = require("../middlewares/dateTimeMW");

exports.getScheduleByDoctorId = (request, response, next) => {
    SchedulaSchema.find({ doctor_id: request.params.id })
        .populate({ path: "doc_id" })
        .then(async(data) => {
            if (data != null) {
                response.status(200).json(data);

            } else {
                response.json({ message: "Id not Found" });
            }
        })
        .catch((error) => next(error));
};

exports.newSchedule = (request, response, next) => {
    const schedule = new SchedulaSchema({
        doc_id: request.body.doctor_id,
        date: dateTimeMW.getDateFormat(new Date()),
        from: dateTimeMW.getTimeFromString(request.body.from),
        to: dateTimeMW.getTimeFromString(request.body.to),
        duration_in_minutes: request.body.duration,
        appointment:request.body.appointment,
    })
    schedule.save()
        .then(result => {
            if (appointment.doctor_id == doc_id)
            {
                console.log("equal");
                response.status(201).json(result);
            }
            else {
                console.log("not equal");

            }
        })
        .catch(error => next(error));

};

