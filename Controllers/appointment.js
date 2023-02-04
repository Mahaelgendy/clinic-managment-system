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

module.exports.addAppointment=async (request , response , next)=>{
    
    let appointmentDate = request.body.date;
    let startOfAppointment = request.body.from;
    let doctorId =request.body.doctorId;
    let endOfAppointment = await getEndOfAppointment(doctorId,appointmentDate,startOfAppointment);
    
    if (endOfAppointment != null){
        console.log(endOfAppointment);
        let isFree = await checkIfThisTimeSlotIsFree(doctorId, appointmentDate , startOfAppointment, endOfAppointment)
        console.log('isfree',isFree)
        if(isFree){
            let newAppointment = new appointmentSchema({
                clinic_id: request.body.clinicId,
                doctor_id:request.body.doctorId,
                patient_id: request.body.patientId,
                employee_id: request.body.employeeId,
                date: appointmentDate,
                from: dateTimeMW.getTimeFromString(startOfAppointment),
                to : dateTimeMW.getTimeFromString(endOfAppointment),
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
            let error = new Error("this time is ovelapped with another one please select another time ");
            error.status=401;
            next(error);
        }
    } 
    else{
        let error = new Error("There is No shift in this Day for that Doctor ");
            error.status=401;
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
    try {
        let doctorSchedule=await schedulesSchema.findOne({doc_id : doctorId, date: appointmentDate })
        if(doctorSchedule != null){

            let appointmentDurationInMinutes = doctorSchedule.duration_in_minutes;

            let startOfAppintmentAsDateTime= dateTimeMW.getTimeFromString(startofAppointment);

            startOfAppintmentAsDateTime.setMinutes(startOfAppintmentAsDateTime.getMinutes() + appointmentDurationInMinutes -1);
            let endOfAppintment = dateTimeMW.getTime(startOfAppintmentAsDateTime);
            return endOfAppintment;
        }
        else{
            return null;
        }
    }
    catch (error) {
        console.log(error);
        return null;
      }
}

async function checkIfThisTimeSlotIsFree(doctorId,appointmentDate,startOfAppointment ,endOfAppointment){
    try {
        let doctorSchedule = await schedulesSchema.findOne({doc_id : doctorId , date: appointmentDate })
        if(doctorSchedule != null){

            console.log(doctorSchedule);
            let startOfShift = dateTimeMW.getDateTimeForSpecificDay(doctorSchedule.from , appointmentDate);
            let endOfShift = dateTimeMW.getDateTimeForSpecificDay(doctorSchedule.to , appointmentDate);
        
            let startOfAppointmentAsDatetime = dateTimeMW.getDateTimeForSpecificDay(dateTimeMW.getTimeFromString(startOfAppointment), appointmentDate);
            let endOfAppointmentAsDatetime = dateTimeMW.getDateTimeForSpecificDay(dateTimeMW.getTimeFromString(endOfAppointment), appointmentDate);
            
            if (checkIsTimeInEmployeeShift(startOfAppointmentAsDatetime , endOfAppointmentAsDatetime , startOfShift , endOfShift))
            {
                console.log("here");
                let isNotOverlapped = await checkIfTimeOverLapWithAnotherAppointmentInSameDay(doctorId, startOfAppointmentAsDatetime, endOfAppointmentAsDatetime, appointmentDate);
                console.log("overlap", isNotOverlapped);
                return isNotOverlapped;
            }
            else
                return false;
        }
        else
            return false;
    }
    catch (error) {
        console.log(error);
        return null;
      }
}

function checkIsTimeInEmployeeShift(startOfAppointment , endOfAppointment , startOfShift , endOfShift){
    return startOfAppointment >= startOfShift && endOfAppointment <= endOfShift
}
async function checkIfTimeOverLapWithAnotherAppointmentInSameDay(doctorId,startOfAppointment, endOfAppintment,appointmentDate){
    try{
        let allAppointments= await appointmentSchema.find({doctor_id : doctorId , date:appointmentDate })
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
    catch (error) {
        console.log(error);
        return null;
      }
}