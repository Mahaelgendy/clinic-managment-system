const mongoose = require("mongoose");
require("./../Models/doctorModel");
require("./../Models/appointmentModel");
const appointmentSchema = mongoose.model("appointments");
const schedulesSchema = mongoose.model("schedules");
const dateTimeMW = require("./../middlewares/dateTimeMW");
const {body , param} = require("express-validator");


exports.appointmentBodyValidation = [
    body("doctorId").isInt().notEmpty().withMessage("Doctor ID must be Numeric and required"),
    body("clinicId").isInt().notEmpty().withMessage("ClinicID must be Numeric and required"),
    body("patientId").isInt().notEmpty().withMessage("Patient ID must be Numeric and required"),
    body("employeeId").isInt().notEmpty().withMessage("Employee ID must be Numeric and required"),
    body("status").isIn(['First Time' , 'Follow Up']).notEmpty().withMessage("Status should be First Time or Follow Up"),
    body("reservationMethod").isIn(['Online' , 'Offline']).notEmpty().withMessage("Reservation method should be Either Online or Offline"),
    body("date").isString().notEmpty().matches(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/).withMessage("Date must be string in format YYYY-MM-DD"),
    body("from").isString().notEmpty().matches(/^(?:(?:[0-1][0-9]|2[0-3]):[0-5]?[0-9](?::[0-5]?[0-9])?)|(?:[0-9]:[0-5]?[0-9](?::[0-5]?[0-9])?)$/).withMessage("From time must be string in format hh:mm:ss"),
]
exports.idParamValidation = [
    param('id').isInt().withMessage("Id should be interger")
]

module.exports.getEndOfAppointment=async(clinicId,doctorId,appointmentDate,startofAppointment)=>{
    try {
        let doctorSchedule=await schedulesSchema.findOne({doc_id : doctorId, date: appointmentDate, clinic_id:clinicId })
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
module.exports.checkIfThisTimeSlotIsFree= async(appointmentId,clinicId,doctorId,appointmentDate,startOfAppointment ,endOfAppointment)=>{
    try {
        let doctorSchedule = await schedulesSchema.findOne({doc_id : doctorId , date: appointmentDate, clinic_id : clinicId })
        if(doctorSchedule != null){

            console.log(doctorSchedule);
            let startOfShift = dateTimeMW.getDateTimeForSpecificDay(doctorSchedule.from , appointmentDate);
            let endOfShift = dateTimeMW.getDateTimeForSpecificDay(doctorSchedule.to , appointmentDate);
            
            let startOfAppointmentAsDatetime = dateTimeMW.getDateTimeForSpecificDay(dateTimeMW.getTimeFromString(startOfAppointment), appointmentDate);
            let endOfAppointmentAsDatetime = dateTimeMW.getDateTimeForSpecificDay(dateTimeMW.getTimeFromString(endOfAppointment), appointmentDate);
            
            if (checkIsTimeInEmployeeShift(startOfAppointmentAsDatetime , endOfAppointmentAsDatetime , startOfShift , endOfShift))
            {
                console.log("here");
                let isNotOverlapped = await checkIfTimeOverLapWithAnotherAppointmentInSameDay(appointmentId,clinicId,doctorId, startOfAppointmentAsDatetime, endOfAppointmentAsDatetime, appointmentDate);
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
async function checkIfTimeOverLapWithAnotherAppointmentInSameDay(appointmentId,clinicId,doctorId,startOfAppointment, endOfAppintment,appointmentDate){
    try{
        let allAppointments= await appointmentSchema.find({doctor_id : doctorId , date:appointmentDate , clinic_id:clinicId , _id: {$ne: appointmentId}})
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