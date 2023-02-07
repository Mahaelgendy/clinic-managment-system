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

const path = require("path");
const stripe = require("stripe")("Add your secret key");

exports.getAllInvoices = (request, response, next) => {

    const query = {};
    if (request.query.doctor_id) query.doctor_id = Number(request.query.doctor_id);
    if (request.query.patient_id) query.patient_id = Number(request.query.patient_id);
    if (request.query.employee_id) query.employee_id = Number(request.query.employee_id);
    if (request.query.appointment_id) query.appointment_id = Number(request.query.appointment_id);
    if (request.query.clinic_id) query.clinic_id = Number(request.query.clinic_id);
    if (request.query.service_id) query.service_id = Number(request.query.service_id);
    if (request.query.paymentMethod) query.paymentMethod = request.query.paymentMethod;
    if (request.query.paymentStatus) query.paymentStatus = request.query.paymentStatus;
    if (request.query.date) query.date = request.query.date;

    invoiceSchema.find(query).populate({ path: "clinic_id" })
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


exports.deleteInvoiceByFilter = (request, response, next) => {
    const query = {};
    if (request.query.doctor_id) query.doctor_id = Number(request.query.doctor_id);
    if (request.query.patient_id) query.patient_id = Number(request.query.patient_id);
    if (request.query.employee_id) query.employee_id = Number(request.query.employee_id);
    if (request.query.appointment_id) query.appointment_id = Number(request.query.appointment_id);
    if (request.query.clinic_id) query.clinic_id = Number(request.query.clinic_id);
    if (request.query.service_id) query.service_id = Number(request.query.service_id);
    if (request.query.paymentMethod) query.paymentMethod = request.query.paymentMethod;
    if (request.query.paymentStatus) query.paymentStatus = request.query.paymentStatus;
    if (request.query.date) query.date = request.query.date;

    invoiceSchema.deleteMany(query)
        .then((result) => {
            if (result.deletedCount == 1) {
                response.status(201).json({ message: " Invoice deleted" })
            }
            else
                throw new Error("Invoice not found");
        })
        .catch((error) => next(error));
};


// exports.payment= async (req, res) => {
//     const { product } = req.body;
//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items: [
//             {
//                 price_data: {
//                     currency: "inr",
//                     product_data: {
//                         name: product.name,
//                         images: [product.image],
//                     },
//                     unit_amount: product.amount * 100,
//                 },
//                 quantity: product.quantity,
//             },
//         ],
//         mode: "payment",
//         success_url: `${YOUR_DOMAIN}/success.html`,
//         cancel_url: `${YOUR_DOMAIN}/cancel.html`,
//     });

//     res.json({ id: session.id });
// }
