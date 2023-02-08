const mongoose = require("mongoose");
require("./../Models/appointmentModel");
require("./../Models/doctorModel");
const appointmentSchema = mongoose.model("appointments");
const dateTimeMW = require("./../middlewares/dateTimeMW")
const appointmentMW = require("./../middlewares/appointmentMW")

const sortAppointment = (data,query)=>{
    let sortBy = query.sortBy||'date';
    let order = query.order ||"asc";
    let orderValue = order ==="asc"? 1:-1
    console.log(orderValue);

    if (sortBy=='fullName' || sortBy == 'fullname'){
        data.sort((a, b) => {
            if (a.doctor_id.userData.fullName < b.doctor_id.userData.fullName) {
                return 1;
            }
            if (a.doctor_id.userData.fullName > b.doctor_id.userData.fullName) {
                return -1;
            }
            return 0;
        });
    }
    else{
        return data.sort((a,b)=>{
            if(a[sortBy]<b[sortBy]) return -1*orderValue;
            if(a[sortBy]>b[sortBy]) return 1*orderValue;
        });
    }
};

module.exports.getAllAppointments = (request , response , next)=>{
    const query = {};
    
    if (request.query.clinicId) query.clinic_id = Number(request.query.clinicId);
    if (request.query.doctorId) query.doctor_id = Number(request.query.doctorId);
    if (request.query.patientId) query.patient_id = Number(request.query.patientId);
    if (request.query.employeeId) query.employee_id = Number(request.query.employeeId);
    if (request.query.date) query.date = request.query.date;
    if (request.query.status) query.status = request.query.status;
    if (request.query.reservationMethod) query.reservation_method = request.query.reservationMethod;
    
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
            sortAppointment(data,request.query);
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
                response.status(200).json(data);
            }else{
                response.json({message:"Id not Found"});
            }
        })
        .catch((error)=>next(error));
};
module.exports.getAppointmentbyDoctorId = (request , response , next)=>{
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
                response.status(200).json(data);
            }else{
                response.json({message:"Id not Found"});
            }
        })
        .catch((error)=>next(error));
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