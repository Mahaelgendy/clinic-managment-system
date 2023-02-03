const mongoose = require("mongoose");
require("./../Models/appointmentModel");
const appointmentSchema = mongoose.model("appointments");
const dateTimeMW = require("./../middlewares/dateTimeMW")

module.exports.getAllAppointments = (request , response , next)=>{
    appointmentSchema.find().populate({ path: "clinic_id"})
                            .populate({ path: "doctor_id"})
                            .populate({ path: "patient_id"})
                            .populate({path: "employee_id"})
                            .then((data)=>{
                                response.status(200).json(data);
                            })
                            .catch((error)=>next(error));
};

module.exports.addAppointment=(request , response , next)=>{
    
    let newAppointment = new appointmentSchema({
        clinic_id: request.body.clinicId,
        doctor_id:request.body.doctorId,
        patient_id: request.body.patientId,
        employee_id: request.body.employeeId,
        date: dateTimeMW.getDateFormat(new Date()),
        time: dateTimeMW.getTime(new Date()) ,
        status: request.body.status,
        reservation_method:request.body.reservationMethod
        }
    );
    newAppointment.save()
    .then(result=>{
        response.status(201).json(result);
    })
    .catch(error => next(error));
};

module.exports.updateAppointment=(request , response , next)=>{
    appointmentSchema.updateOne({
        _id : request.body.id
    },
    {
        $set:{ fullName: request.body.fullName,
            clinic_id: request.body.clinicId,
            doctor_id:request.body.doctorId,
            patient_id: request.body.patientId,
            employee_id: request.body.employeeId,
            date: request.body.date,
            time: request.body.time,
            status: request.body.status,
            reservation_method:request.body.reservationMethod
        }
    }).then(result=>{
        respose.status(201).json(result);
    })
    .catch(error => next(error));
};

module.exports.deleteAppointment = (request , respose , next)=>{
    appointmentSchema.deleteOne({_id : request.body.id})
        .then((data)=>{
            respose.status(200).json(data);
        })
        .catch((error)=>next(error));
};


