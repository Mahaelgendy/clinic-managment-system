const mongoose = require("mongoose");
require("./../Models/appointmentModel");
require("./../Models/doctorModel");

const appointmentSchema = mongoose.model("appointments");
const doctorSchema = mongoose.model("doctors");
const dateTimeMW = require("./../middlewares/dateTimeMW")
const appointmentMW = require("./../middlewares/appointmentMW")



module.exports.getAllAppointments = (request , response , next)=>{
    const query = {};
    
    if (request.query.clinicId) query.clinic_id = Number(request.query.clinicId);
    if (request.query.doctorId) query.doctor_id = Number(request.query.doctorId);
    if (request.query.patientId) query.patient_id = Number(request.query.patientId);
    if (request.query.employeeId) query.employee_id = Number(request.query.employeeId);
    if (request.query.date) query.date = request.query.date;
    if (request.query.status) query.status = request.query.status;
    if (request.query.reservationMethod) query.reservation_method = request.query.reservationMethod;

    console.log(query)
    appointmentSchema.find(query)
        .populate({ path: "clinic_id" ,select: 'clinicName'})
        .populate({
            path: 'doctor_id',
            select: 'userData',
            model: 'doctors',
            populate: {path: 'userData', select: 'fullName', model: 'users'}
        })
        .populate({ 
            path: "patient_id",
            select: 'patientData',
            model: 'patients',
            populate: {path: 'patientData', select: 'fullName', model: 'users'}
        })
        .populate({
            path: "employee_id",
            select: 'employeeData',
            model: 'employees',
            populate: {path: 'employeeData', select: 'fullName', model: 'users'}
        })
        .then((data)=>{
            if (request.role == 'doctor') {
                const filteredData = data.filter(appointment => {
                    return appointment.doctor_id.userData._id.toString() === request.id;})
                appointmentMW.sortAppointment(filteredData,request.query);
                response.status(200).json(filteredData);
            }
            else if (request.role == 'admin') {
                appointmentMW.sortAppointment(data,request.query);
                response.status(200).json(data);
            }
            else if(request.role == 'employee'){
                const filteredData = data.filter(appointment => {
                    return appointment.employee_id.employeeData._id.toString() === request.id;})
                appointmentMW.sortAppointment(filteredData,request.query);
                response.status(200).json(filteredData);
            }
            else if(request.role == 'patient' ){
                const filteredData = data.filter(appointment => {
                    return appointment.patient_id.patientData._id.toString() === request.id;})
                appointmentMW.sortAppointment(filteredData,request.query);
                response.status(200).json(filteredData);
            }
            else{
                response.json({message:"You aren't authourized to see this data"});
            }
        })
        .catch((error)=>next(error));
};
module.exports.getAppointmentbyId = (request , response , next)=>{
    appointmentSchema.findById({_id : request.params.id})
        .populate({ path: "clinic_id" ,select: 'clinicName'})
        .populate({
            path: 'doctor_id',
            select: 'userData',
            model: 'doctors',
            populate: {path: 'userData', select: 'fullName', model: 'users'}
        })
        .populate({ 
            path: "patient_id",
            select: 'patientData',
            model: 'patients',
            populate: {path: 'patientData', select: 'fullName', model: 'users'}
        })
        .populate({
            path: "employee_id" ,
            select: 'employeeData',
            model: 'employees',
            populate: {path: 'employeeData', select: 'fullName', model: 'users'}
        })
        .then(data=>{
            if(data!=null){
                if (request.role == 'doctor' && (data.doctor_id.userData == request.id)) {
                    response.status(200).json(data);
                }
                else if (request.role == 'admin') {
                    response.status(200).json(data);
                }
                else if(request.role == 'employee' && (data.employee_id.employeeData == request.id)){
                    response.status(200).json(data);
                }
                else if(request.role == 'patient' && (data.patient_id.patientData == request.id)){
                    response.status(200).json(data);
                }
                else{
                    response.json({message:"You aren't authourized to see this data"});
                }
            }else{
                response.json({message:"Id not Found"});
            }
        })
        .catch((error)=>next(error));
};
module.exports.getAppointmentbyDoctorId = async(request , response , next)=>{
    let doctor= await doctorSchema.findById({_id:request.params.id}).populate({path: 'userData', select: 'fullName', model: 'users'});

    if(request.role == 'doctor' && doctor.userData._id.toString() != request.id){
        response.json({message:"You aren't authourized to see this data"});
    }
    else{
        appointmentSchema.find({doctor_id : request.params.id})
            .populate({ path: "clinic_id" ,select: 'clinicName'})
            .populate({
                path: 'doctor_id',
                select: 'userData',
                model: 'doctors',
                populate: {path: 'userData', select: 'fullName', model: 'users'}
            })
            .populate({ 
                path: "patient_id" ,
                select: 'patientData',
                model: 'patients',
                populate: {path: 'patientData', select: 'fullName', model: 'users'}
            })
            .populate({
                path: "employee_id" ,
                select: 'employeeData',
                model: 'employees',
                populate: {path: 'employeeData', select: 'fullName', model: 'users'}
            })
            .then(data=>{
                if(data!=null){
                    console.log(data);
                    if (request.role == 'doctor') {
                        const filteredData = data.filter(appointment => {
                            return appointment.doctor_id.userData._id.toString() === request.id;})
                        response.status(200).json(filteredData);
                    }
                    else if (request.role == 'admin') {
                        response.status(200).json(data);
                    }
                    else if(request.role == 'employee'){
                        const filteredData = data.filter(appointment => {
                            if(appointment.employee_id != null)
                                return appointment.employee_id.employeeData._id.toString() === request.id;
                            else
                                return false;
                        })
                        response.status(200).json(filteredData);
                    }
                    else{
                        response.json({message:"You aren't authourized to see this data"});
                    }
                }else{
                    response.json({message:"Id not Found"});
                }
            })
            .catch((error)=>next(error));
    }
};
module.exports.getAppointmentbyClinicId = (request , response , next)=>{
    
    appointmentSchema.find({clinic_id : request.params.id})
        .populate({ path: "clinic_id"  ,select: 'clinicName'})
        .populate({
            path: 'doctor_id',
            select: 'userData',
            model: 'doctors',
            populate: {path: 'userData', select: 'fullName', model: 'users'}
        })
        .populate({ 
            path: "patient_id" ,
            select: 'patientData',
            model: 'patients',
            populate: {path: 'patientData', select: 'fullName', model: 'users'}
        })
        .populate({
            path: "employee_id" ,
            select: 'employeeData',
            model: 'employees',
            populate: {path: 'employeeData', select: 'fullName', model: 'users'}
        })
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
    let patientId = request.body.patientId;
    let employeeId = request.body.employeeId;

    if (await appointmentMW.checkAllUsersAvailability(doctorId, clinicId, patientId, employeeId)){
        let endOfAppointment = await appointmentMW.getEndOfAppointment(clinicId,doctorId,appointmentDate,startOfAppointment);
        
        if (endOfAppointment != null){
    
            let isFree = await appointmentMW.checkIfThisTimeSlotIsFree(null,clinicId,doctorId, appointmentDate , startOfAppointment, endOfAppointment)
            console.log('isfree',isFree)
    
            if(isFree){
                let newAppointment = new appointmentSchema({
                    clinic_id: clinicId,
                    doctor_id:doctorId,
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
                    appointmentMW.sendMailToTheDoctor(doctorId,appointmentDate,startOfAppointment);
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
        
    }
    else{
        let error = new Error("There is No Doctor or patient or employee or clinic with that id ");
                error.status=401;
                next(error);
    }
};

module.exports.updateAppointment=async (request , response , next)=>{
    
    let appointmentDate = request.body.date;
    let startOfAppointment = request.body.from;
    let doctorId =request.body.doctorId;
    let clinicId = request.body.clinicId;
    let patientId = request.body.patientId;
    let employeeId = request.body.employeeId;
    let appointmentId = request.params.id;

    if (await appointmentMW.checkAllUsersAvailability(doctorId, clinicId, patientId, employeeId)){
        
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
    }
    else{
        let error = new Error("There is No Doctor or patient or employee or clinic with that id ");
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

module.exports.deleteAppointmentByFilter = (request , respose , next)=>{
    const query = {};
    if (request.query.clinicId) query.clinic_id = Number(request.query.clinicId);
    if (request.query.doctorId) query.doctor_id = Number(request.query.doctorId);
    if (request.query.patientId) query.patient_id = Number(request.query.patientId);
    if (request.query.employeeId) query.employee_id = Number(request.query.employeeId);
    if (request.query.date) query.date = request.query.date;
    if (request.query.status) query.status = request.query.status;
    if (request.query.reservationMethod) query.reservation_method = request.query.reservationMethod;

    appointmentSchema.deleteMany(query)
        .then((data)=>{
            respose.status(200).json(data);
        })
        .catch((error)=>next(error));
};