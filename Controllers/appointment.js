const mongoose = require("mongoose");
require("./../Models/appointmentModel");
require("./../Models/doctorModel");
require("./../Models/employeeModel");

const appointmentSchema = mongoose.model("appointments");
const doctorSchema = mongoose.model("doctors");
const employeeSchema = mongoose.model('employees');


const dateTimeMW = require("./../middlewares/dateTimeMW")
const appointmentMW = require("./../middlewares/appointmentMW");
const e = require("express");



module.exports.getAllAppointments = (request , response , next)=>{
    const query = appointmentMW.getTheQueryToFindWith(request);
    console.log(query);
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
            console.log(data)
            console.log(request.role)
            if (request.role == 'doctor') {
                const filteredData = data.filter(appointment => {
                    return appointment.doctor_id?.userData?._id.toString() === request.id;})
                appointmentMW.sortAppointment(filteredData,request.query);
                response.status(200).json(filteredData);
            }
            else if (request.role == 'admin') {
                appointmentMW.sortAppointment(data,request.query);
                response.status(200).json(data);
            }
            else if(request.role == 'employee'){
                const filteredData = data.filter(appointment => {
                    return appointment.employee_id?.employeeData?._id.toString() === request.id;})
                appointmentMW.sortAppointment(filteredData,request.query);
                response.status(200).json(filteredData);
            }
            else if(request.role == 'patient' ){
                const filteredData = data.filter(appointment => {
                    return appointment.patient_id?.patientData?._id.toString() === request.id;})
                appointmentMW.sortAppointment(filteredData,request.query);
                response.status(200).json(filteredData);
            }
            else{
                console.log(data)
                response.status(200).json(data);
                // response.json({message:"You aren't authourized to see this data"});
            }
        })
        .catch((error)=>next(error));
};

module.exports.getAppointmentsByDate = (request , response , next)=>{
    const query = appointmentMW.getTheQueryToFindWith(request);

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
            response.status(200).json(data);
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
                if (request.role == 'doctor' && (data.doctor_id.userData._id == request.id)) {
                    response.status(200).json(data);
                }
                else if (request.role == 'admin') {
                    response.status(200).json(data);
                }
                else if(request.role == 'employee' && (data.employee_id.employeeData._id == request.id)){
                    response.status(200).json(data);
                }
                else if(request.role == 'patient' && (data.patient_id.patientData._id == request.id)){
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
    if(request.role == 'doctor'){
        if(doctor == null ||  doctor.userData._id != request.id)
            response.json({message:"You aren't authourized to see this data"});
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
    let doctorId =request.body.doctor_id;
    let clinicId = request.body.clinic_id;
    let patientId = request.body.patient_id;
    let employeeId = request.body.employee_id;

    if (await appointmentMW.checkAllUsersAvailability(doctorId, clinicId, patientId)){
        let endOfAppointment = await appointmentMW.getEndOfAppointment(clinicId,doctorId,appointmentDate,startOfAppointment);
        
        if (endOfAppointment != null){
    
            let isFree = await appointmentMW.checkIfThisTimeSlotIsFree(null,clinicId,doctorId, appointmentDate , startOfAppointment, endOfAppointment)

            if(isFree){
                let newAppointment = new appointmentSchema({
                    clinic_id: clinicId,
                    doctor_id:doctorId,
                    patient_id: patientId,
                    employee_id:null,
                    date: appointmentDate,
                    from: dateTimeMW.getTimeFromString(startOfAppointment),
                    to : dateTimeMW.getTimeFromString(endOfAppointment),
                    status: request.body.status,
                    reservation_method:request.body.reservation_method
                    }
                );
                if(request.body.reservationMethod == "Offline"){
                    let employee = await employeeSchema.findById(employeeId);
                    if(employee != null){
                        newAppointment.employee_id= request.body.employeeId;
                    }
                    else{
                        let error = new Error("There is No employee that id ");
                        error.status=401;
                        next(error);
                    }
                }
                newAppointment.save()
                .then(result=>{
                    response.status(201).json({message:"appointment added"});
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

module.exports.updateAppointment=async(request , response , next)=>{

    let appointmentDate = request.body.date;
    let startOfAppointment = dateTimeMW.getTime(request.body.from);
    console.log(startOfAppointment);
    let appointmentId = request.params.id;

    let currentAppointment = await appointmentSchema.findById({_id : appointmentId})
                        .populate({ 
                            path: "patient_id" ,
                            select: 'patientData',
                            model: 'patients',
                            populate: {path: 'patientData', select: 'fullName', model: 'users'}
                        });

    let doctorId =currentAppointment.doctor_id;
    let clinicId = currentAppointment.clinic_id;

    if((request.role == 'patient' && currentAppointment.patient_id.patientData._id == request.id)|| request.role == 'employee'){
        console.log("here")
        let endOfAppointment = await appointmentMW.getEndOfAppointment(clinicId,doctorId,appointmentDate,startOfAppointment);
        if (endOfAppointment != null){
    
            let isFree = await appointmentMW.checkIfThisTimeSlotIsFree(appointmentId,clinicId,doctorId, appointmentDate , startOfAppointment, endOfAppointment)
            console.log('isfree',isFree)
            if(isFree){
                await appointmentSchema.updateOne({
                    _id : appointmentId
                },
                {
                    $set:{ 
                        date: appointmentDate,
                        from:dateTimeMW.getTimeFromString(startOfAppointment),
                        to: dateTimeMW.getTimeFromString(endOfAppointment),
                        status: request.body.status,
                        reservation_method:request.body.reservation_method
                    }
                }).then(result=>{
                    response.status(201).json({message:"appointment updated"});
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
    }else{
        response.json({message:"You aren't authourized to see this data"});
    }

};

module.exports.deleteAppointmentById = async (request , response , next)=>{
    let appointmentId =request.params.id
    let currentAppointment = await appointmentSchema.findById({_id : appointmentId})
                        .populate({ 
                            path: "patient_id" ,
                            select: 'patientData',
                            model: 'patients',
                            populate: {path: 'patientData', select: 'fullName', model: 'users'}
                        });
    console.log(currentAppointment,request.id)
    
    if((request.role == 'patient' && currentAppointment.patient_id.patientData._id == request.id )|| request.role == 'employee'){
        appointmentSchema.deleteOne({_id : appointmentId})
            .then((data)=>{
                response.status(200).json({message:"deleted"});
            })
            .catch((error)=>next(error));
    }
    else{
        response.json({message:"You aren't authourized to see this data"});
    }
};

module.exports.deleteAppointmentByFilter = (request , respose , next)=>{
     const query = appointmentMW.getTheQueryToFindWith(request);
    appointmentSchema.deleteMany(query)
        .then((data)=>{
            respose.status(200).json(data);
        })
        .catch((error)=>next(error));
};