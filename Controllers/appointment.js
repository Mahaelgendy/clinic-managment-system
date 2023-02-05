const mongoose = require("mongoose");
require("./../Models/appointmentModel");
const appointmentSchema = mongoose.model("appointments");
const dateTimeMW = require("./../middlewares/dateTimeMW")
const appointmentMW = require("./../middlewares/appointmentMW")

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

module.exports.getAppointmentbyId = (request , response , next)=>{
    appointmentSchema.findById({_id : request.params.id})
        .populate({ path: "clinic_id"})
        .populate({ path: "doctor_id"})
        .populate({ path: "patient_id"})
        .populate({path: "employee_id"})
        .then(data=>{
            if(data!=null){
                response.status(200).json(data);
            }else{
                response.json({message:"Id not Found"});
            }
        })
        .catch((error)=>next(error));
};
module.exports.getAppointmentbyDoctorId = (request , response , next)=>{
    appointmentSchema.find({doctor_id : request.params.id})
        .populate({ path: "clinic_id"})
        .populate({ path: "doctor_id"})
        .populate({ path: "patient_id"})
        .populate({path: "employee_id"})
        .then(data=>{
            if(data!=null){
                response.status(200).json(data);
            }else{
                response.json({message:"Id not Found"});
            }
        })
        .catch((error)=>next(error));
};
module.exports.getAppointmentbyClinicId = (request , response , next)=>{
    appointmentSchema.find({clinic_id : request.params.id})
        .populate({ path: "clinic_id"})
        .populate({ path: "doctor_id"})
        .populate({ path: "patient_id"})
        .populate({path: "employee_id"})
        .then(data=>{
            if(data!=null){
                response.status(200).json(data);
            }else{
                response.json({message:"Id not Found"});
            }
        })
        .catch((error)=>next(error));
};

module.exports.addAppointment=async(request , response , next)=>{
    
    let appointmentDate = request.body.date;
    let startOfAppointment = request.body.from;
    let doctorId =request.body.doctorId;
    let clinicId = request.body.clinicId;
    let endOfAppointment = await appointmentMW.getEndOfAppointment(clinicId,doctorId,appointmentDate,startOfAppointment);
    
    if (endOfAppointment != null){

        let isFree = await appointmentMW.checkIfThisTimeSlotIsFree(null,clinicId,doctorId, appointmentDate , startOfAppointment, endOfAppointment)
        console.log('isfree',isFree)

        if(isFree){
            let newAppointment = new appointmentSchema({
                clinic_id: clinicId,
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

module.exports.updateAppointment=async (request , response , next)=>{

    let appointmentDate = request.body.date;
    let startOfAppointment = request.body.from;
    let doctorId =request.body.doctorId;
    let clinicId = request.body.clinicId;
    let appointmentId = request.params.id;

    let endOfAppointment = await appointmentMW.getEndOfAppointment(clinicId,doctorId,appointmentDate,startOfAppointment);
    if (endOfAppointment != null){

        let isFree = await appointmentMW.checkIfThisTimeSlotIsFree(appointmentId,clinicId,doctorId, appointmentDate , startOfAppointment, endOfAppointment)
        console.log('isfree',isFree)
        if(isFree){
            appointmentSchema.updateOne({
                _id : appointmentId
            },
            {
                $set:{ 
                    clinic_id: clinicId,
                    doctor_id:doctorId,
                    patient_id: request.body.patientId,
                    employee_id: request.body.employeeId,
                    date: appointmentDate,
                    From:dateTimeMW.getTimeFromString(startOfAppointment),
                    to : dateTimeMW.getTimeFromString(endOfAppointment),
                    status: request.body.status,
                    reservation_method:request.body.reservationMethod
                }
            }).then(result=>{
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

module.exports.deleteAppointmentById = (request , respose , next)=>{
    appointmentSchema.deleteOne({_id : request.params.id})
        .then((data)=>{
            respose.status(200).json(data);
        })
        .catch((error)=>next(error));
};