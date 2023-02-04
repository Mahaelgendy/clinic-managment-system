const {request , response} = require("express");
const mongoose = require("mongoose");

require('../Models/invoiceModel');
const dateTimeMW = require("./../middlewares/dateTimeMW")

const invoiceSchema = mongoose.model("invoices");



exports.getAllInvoices = (request, response, next) => {
    invoiceSchema.find({}).populate("doctor_id  patient_id employee_id appointment_id clinic_id")
        .then((data) => {
            console.log(data)

            response.status(200).json(data);
        })
        .catch(error => next(error));
};


exports.getInvoiceById = (request, response, next) => {
    invoiceSchema.find({ _id: request.params.id }).populate("doctor_id  patient_id employee_id appointment_id clinic_id")
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

exports.addInvoice = (request, response, next) => {
    let newInvoice = new invoiceSchema({
        clinic_id: request.body.clinicId,
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
    invoiceSchema.updateOne({ _id: request.body.id },
        {
            $set: {
                clinic_id: request.body.clinicId,
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
    invoiceSchema.deleteOne({ _id: request.body.id })
        .then((result) => {
            if (result.deletedCount == 1) {
                response.status(201).json({ message: " Invoice deleted" })
            }
            else
                throw new Error("Invoice not found");
        })
        .catch((error) => next(error));
};


