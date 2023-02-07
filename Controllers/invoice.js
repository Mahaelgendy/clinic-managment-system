const {request , response} = require("express");
const mongoose = require("mongoose");

require('../Models/invoiceModel');
const dateTimeMW = require("./../middlewares/dateTimeMW")

const invoiceSchema = mongoose.model("invoices");
const DoctorSchema = mongoose.model('doctors');
const appointmentSchema= mongoose.model('appointments');
 const employeeSchema = mongoose.model("employees");
const clinicSchema= mongoose.model('clinics');
const patientSchema= mongoose.model('patients');
const serviceSchema= mongoose.model('services');


exports.getAllInvoices = (request, response, next) => {
    invoiceSchema.find({}).populate({ path: "clinic_id" })
        .populate({
            path: "doctor_id", select: { userData:1,_id:0 }, model: "doctors",
            populate: { path: "userData", select: {fullName:1,_id:0 }, model: "users" }
        })
        .populate({
            path: "patient_id", select: { userData:1,_id:0 }, model: "doctors",
            populate: { path: "userData", select: {fullName:1,_id:0 }, model: "users" }})
        .populate({ path: "employee_id", select: {userData:1,_id:0 }, model: "doctors",
            populate: { path: "userData", select: {fullName:1,_id:0 }, model: "users" }})
        .populate({path: "appointment_id",select: "date"})
        .populate({path: "clinic_id",select: {clinicName:1,_id:0}})
        .populate({path: "service_id",select:{name:1,_id:0}})

        .then((data) => {
            console.log(data)

            response.status(200).json(data);
        })
        .catch(error => next(error));
};


exports.getInvoiceById = (request, response, next) => {
    invoiceSchema.find({ _id: request.params.id })
        .populate({
            path: "doctor_id", select: { userData:1,_id:0 }, model: "doctors",
            populate: { path: "userData", select: {fullName:1,_id:0 }, model: "users" }
        })
        .populate({
            path: "patient_id", select: { userData:1,_id:0 }, model: "doctors",
            populate: { path: "userData", select: {fullName:1,_id:0 }, model: "users" }})
        .populate({ path: "employee_id", select: {userData:1,_id:0 }, model: "doctors",
            populate: { path: "userData", select: {fullName:1,_id:0 }, model: "users" }})
        .populate({path: "appointment_id",select: "date"})
        .populate({path: "clinic_id",select: {clinicName:1,_id:0}})
        .populate({ path: "service_id", select: { name: 1, _id: 0 } })
        
        .then((data) => {
            if (data != null) {
                response.status(201).json({ data })
            }
            else {
                console.log("null")
                next(new Error({ message: "Id doesn't exist" }));
            }
        })
        .catch(error => next(error));
};

exports.addInvoice = async(request, response, next) => {
    const doctorExist=await DoctorSchema.findOne({_id:request.body.doctorId})
    const clinicExist=await clinicSchema.findOne({_id:request.body.clinicId})
    const serviceExist=await serviceSchema.findOne({_id:request.body.serviceId})
    const patientExist = await patientSchema.findOne({ _id: request.body.patientId })
    const employeeExist=await employeeSchema.findOne({_id:request.body.employeeId})
    const appointmentExist = await appointmentSchema.findOne({ _id: request.body.appointmentId })

    if ((!doctorExist)||(!clinicExist)||(!serviceExist)||(!patientExist)||(!employeeExist)||(!appointmentExist)) {
        return response.status(400).json({message:"Check your data "})
    }

    let newInvoice = new invoiceSchema({
        clinic_id: request.body.clinicId,
        service_id: request.body.serviceId,
        doctor_id: request.body.doctorId,
        patient_id: request.body.patientId,
        employee_id: request.body.employeeId,
        appointment_id: request.body.appointmentId,
        paymentMethod: request.body.paymentMethod,
        paymentStatus: request.body.paymentStatus,
        totalCost: request.body.totalCost,
        actualPaid: request.body.actualPaid,
        date: dateTimeMW.getDateFormat(new Date()),
        time: dateTimeMW.getTime(new Date()),

    });
    newInvoice.save()
        .then(result => {
            response.status(201).json(result);
        })
        .catch(error => next(error));
};

exports.updateInvoice = (request, response, next) => {
    invoiceSchema.updateOne({ _id: request.params.id },
        {
            $set: {
                clinic_id: request.body.clinicId,
                doctor_id: request.body.doctorId,
                service_id: request.body.serviceId,
                patient_id: request.body.patientId,
                employee_id: request.body.employeeId,
                appointment_id: request.body.appointmentId,
                paymentMethod: request.body.paymentMethod,
                paymentStatus: request.body.paymentStatus,
                totalCost: request.body.totalCost,
                actualPaid: request.body.actualPaid,
                date: dateTimeMW.getDateFormat(new Date()),
                time: dateTimeMW.getTime(new Date()),
            }
        }).then(result => {
            if (result.modifiedCount == 1) {
                response.status(201).json({ message: "Invoice updated" })
            }
            else
                throw new Error("Invoice not found");
        })
        .catch(error => next(error));
};

exports.deleteInvoice = (request, response, next) => {
    invoiceSchema.deleteOne({ _id: request.params.id })
        .then((result) => {
            if (result.deletedCount == 1) {
                response.status(201).json({ message: " Invoice deleted" })
            }
            else
                throw new Error("Invoice not found");
        })
        .catch((error) => next(error));
};


