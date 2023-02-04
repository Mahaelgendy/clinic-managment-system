const mongoose = require("mongoose");
require("./../Models/appointmentModel");
require("./../Models/doctorModel");
const appointmentSchema = mongoose.model("appointments");
const schedulesSchema = mongoose.model("schedules")
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
    
    let appointmentDate = request.body.date;
    let startOfAppointment = request.body.from;
    let doctorId =request.body.doctorId;
    let endOfAppintment = getEndOfAppointment(doctorId,appointmentDate,startOfAppointment);

    if(checkIfThisTimeSlotIsFree(doctorId, today , startOfAppointment, endOfAppintment)){

        let newAppointment = new appointmentSchema({
            clinic_id: request.body.clinicId,
            doctor_id:request.body.doctorId,
            patient_id: request.body.patientId,
            employee_id: request.body.employeeId,
            date: appointmentDate,
            from: startOfAppointment,
            to : endOfAppintment,
            status: request.body.status,
            reservation_method:request.body.reservationMethod
            }
        );
        newAppointment.save()
        .then(result=>{
            response.status(201).json(result);
        })
        .catch(error => next(error));
    }
    else{
        let error = new Error("Please Check the time with doctor shift");
        error.status(401);
        next(error);
    }
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
            from: request.body.from,
            to: request.body.to,
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

async function getEndOfAppointment(doctorId,appointmentDate,startofAppointment){

    console.log(appointmentDate,doctorId)
    let doctorSchedule = await schedulesSchema.findOne({doc_id : doctorId, date: appointmentDate })
    console.log(doctorSchedule);
    let appointmentDurationInMinutes = doctorSchedule.duration_in_minutes;

    let startOfAppintmentAsDateTime= dateTimeMW.getTimeFromString(startofAppointment);
    startOfAppintmentAsDateTime.setMinutes(startOfAppintmentAsDateTime.getMinutes() + appointmentDurationInMinutes);
    let endOfAppintment = dateTimeMW.getTime(startOfAppintmentAsDateTime);
    return endOfAppintment;
}

async function checkIfThisTimeSlotIsFree(doctorId,appointmentDate,startOfAppointment ,endOfAppointment){
    let doctorSchedule =await schedulesSchema.findOne({_id : doctorId , date: appointmentDate })
    let startOfShift = dateTimeMW.getDateTimeForSpecificDay(doctorSchedule.from , appointmentDate);
    let endOfShift = dateTimeMW.getDateTimeForSpecificDay(doctorSchedule.to , appointmentDate);

    let startOfAppointmentAsDatetime = dateTimeMW.getDateTimeForSpecificDay(getTimeFromString(startOfAppointment), appointmentDate);
    let endOfAppointmentAsDatetime = dateTimeMW.getDateTimeForSpecificDay(getTimeFromString(endOfAppointment), appointmentDate);
    
    if (checkIsTimeInEmployeeShift(startOfAppointmentAsDatetime , endOfAppointmentAsDatetime , startOfShift , endOfShift) && checkIfTimeOverLapWithAnotherAppointmentInSameDay(doctorId,startOfAppointmentAsDatetime , endOfAppointmentAsDatetime,appointmentDate))
    {
        return true;
    }
    return false;
}
function checkIsTimeInEmployeeShift(startOfAppointment , endOfAppointment , startOfShift , endOfShift){
    return startOfAppointment >= startOfShift && endOfAppointment <= endOfShift
}
function checkIfTimeOverLapWithAnotherAppointmentInSameDay(doctorId,startOfAppointment, endOfAppintment,appointmentDate){
    let allAppointments = appointmentSchema.find({_id : doctorId , date:appointmentDate }); 
    for(let i=0 ; i < allAppointments.length ; i++)
    {
        let from= allAppointments[i].from;
        let to = allAppointments[i].to;

        let currentFrom = dateTimeMW.getDateTimeForSpecificDay(from , appointmentDate);
        let currentTo = dateTimeMW.getDateTimeForSpecificDay(to , appointmentDate);
        if (startOfAppointment <= currentFrom && endOfAppintment >= currentFrom || startOfAppointment <= currentTo &&  endOfAppintment >= currentTo || startOfAppointment <= currentFrom && endOfAppintment >= currentTo || startOfAppointment >= currentFrom && endOfAppintment <= currentTo)
            return false;
    }
    return true;
}