const { request, response } = require("express");

const mongoose = require("mongoose");
const stripe = require("stripe")("sk_test_51MYW00L4FZm4LCWYTDkVw2JR6AYkNpcMdotgqSLDCdbiSeaCIz51U1QrcOT3dKepTfgjIZbSzdT3gwIjFa0mdG2W00X1uRIqgn");

const dateTimeMW = require("./../middlewares/dateTimeMW")
const invoiceMW = require("./../middlewares/invoiceMW")

require("../Models/invoiceModel");
const invoiceSchema = mongoose.model("invoices");
const DoctorSchema = mongoose.model('doctors');
const appointmentSchema= mongoose.model('appointments');
const employeeSchema = mongoose.model("employees");
const clinicSchema= mongoose.model('clinics');
const patientSchema= mongoose.model('patients');
const serviceSchema= mongoose.model('services');

const path = require("path");
const { Console } = require("console");

module.exports.getAllInvoices = (request, response, next) => {

    const query = invoiceMW.getQueryToFilterWith(request);

    invoiceSchema.find(query)
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
    .populate({path: "appointment_id",select: "date"})
    .populate({path: "clinic_id",select: {clinicName:1}})
    .populate({path: "service_id",select:{name:1}})
        .then((data) => {
            if(request.role == 'employee'){
                const filteredData = data.filter(invoice => {
                    return invoice.employee_id.employeeData._id.toString() === request.id;})
                invoiceMW.sortInvoice(filteredData,request.query);
                response.status(200).json(filteredData);
            }
            else if (request.role == 'admin') {
                console.log("true, admin")
                response.status(200).json(data);
            }
            else{
                response.json({message:"You aren't authourized to see this data"});
            }
        })
        .catch(error => next(error));
};


module.exports.getInvoiceById = (request, response, next) => {
   
    invoiceSchema.findById({ _id: request.params.id })
        .populate({
            path: "doctor_id",
            select: { userData:1,_id:0 },
            model: "doctors",
            populate: { path: "userData", select: {fullName:1,_id:0}, model: "users" }
        })
        .populate({
            path: "patient_id",
            select: { patientData:1,_id:0 },
            model: "patients",
            populate: { path: "patientData", select: {fullName:1,_id:0 }, model: "users" }
        })
        .populate({ 
            path: "employee_id",
            select: {employeeData:1,_id:0 },
            model: "employees",
            populate: { path: "employeeData", select: {fullName:1,_id:1 }, model: "users" }
        })
        .populate({path: "appointment_id",select: "date"})
        .populate({path: "clinic_id",select: {clinicName:1,_id:0}})
        .populate({path: "service_id", select: { name: 1, _id: 0 } })
        
        .then((data) => {
            // if (data != null) {
            //     console.log(data)
            //     if ((request.role == 'employee') && (request.id == data.employee_id.employeeData._id)) {
            //         console.log("true, employee")
            //         response.status(200).json(data);
            //     }
            //     else if (request.role == 'admin') {
            //         console.log("true, admin")
            console.log(data)
                    response.status(200).json(data);
            //     }
            //     else{
            //         response.json({message:"You aren't authourized to see this data"});
            //     }
            // }

            // else  {
            //     console.log("null")
            //     response.json({message:"Id doesn't exist"});
            // }
        })
        .catch(error => next(error));
};

module.exports.addInvoice = async(request, response, next) => {
    const doctorExist=await DoctorSchema.findOne({_id:request.body.doctor_id})
    const clinicExist=await clinicSchema.findOne({_id:request.body.clinic_id})
    const serviceExist=await serviceSchema.findOne({_id:request.body.service_id})
    const patientExist = await patientSchema.findOne({ _id: request.body.patient_id })
    const employeeExist=await employeeSchema.findOne({_id:request.body.employee_id})
    const appointmentExist = await appointmentSchema.findOne({ _id: request.body.appointment_id })


    if ((!doctorExist)||(!clinicExist)||(!serviceExist)||(!patientExist)||(!employeeExist)||(!appointmentExist)) {
        return response.status(400).json({message:"Check your data "})
    }

    function totalCost() {
      return doctorExist.price+serviceExist.salary
    }
    console.log(request.body);

    let newInvoice = new invoiceSchema({
        clinic_id: request.body.clinic_id,
        service_id: request.body.service_id,
        doctor_id: request.body.doctor_id,
        patient_id: request.body.patient_id,
        employee_id: request.body.employee_id,
        appointment_id: request.body.appointment_id,
        paymentMethod: request.body.paymentMethod,
        paymentStatus: request.body.paymentStatus,
        totalCost: request.body.totalCost,
        actualPaid: request.body.actualPaid,
        date: dateTimeMW.getDateFormat(new Date()),
        time: dateTimeMW.getTime(new Date()),
    });    
    let paymentMethod = request.body.paymentMethod;
    
       if (paymentMethod == 'Credit Card') {
            let createdToken = await stripe.tokens.create({
                card: {
                number: '4242424242424242',
                exp_month: 03,
                exp_year: 2030,
                cvc: '737'
                }
            });
            
            try {
                let charge = await stripe.charges.create({
                amount: totalCost(),
                currency: "usd",
                description: "An example charge",
                source: createdToken.id
                });
            
                let chargeId = charge.id;
                newInvoice.transaction_id = chargeId;
                newInvoice.save()
                    .then(result=>{
                        response.status(201).json({ message:"invoice added",status: charge.status, chargeId });
                    })
                    .catch(
                        error => next(error)
                    );
            } catch (err) {
                response.status(500).end();
            }
        }
        else{
            newInvoice.save()
                    .then(result=>{
                        response.status(201).json(result);
                    })
                    .catch(
                        error => next(error)
                    );
        }
};


module.exports.updateInvoice = async (request, response, next) => {
   
    // await employeeSchema.findOne({ "employeeData": request.body.id })
    //     .then(data => {
    //         console.log(data._id)
    //         let EMPID = data._id
    //         console.log("emp" + EMPID)
            invoiceSchema.findOneAndUpdate({
                _id: request.params.id,
                // employee_id: EMPID
            },
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
                }
            ).then(result => {
                console.log(result)
                if (result) {
                    response.status(201).json({ message: "Invoice updated" })
                }
                else if(result==null)
                    throw new Error("Invoice not found");
            }).catch(error => next(error));

        // })
        // .catch(err => {
        //     throw new Error("employee not found");
        // })
};

module.exports.deleteInvoice = (request, response, next) => {

    // if (request.role == 'admin') {
        invoiceSchema.deleteOne({ _id: request.params.id })
            .then((result) => {
            
                // if (result.deletedCount == 1) {
                    response.status(201).json({ message: " Invoice deleted" })
                //}
                // else
                //     throw new Error("Invoice not found");
            })
            .catch((error) => next(error));
   // }

    // else if (request.role == "employee") {
    //      employeeSchema.findOne({ "employeeData": request.id })
    //     .then(data => {
    //         let EMPID = data._id
    //         invoiceSchema.deleteOne({ _id: request.params.id, employee_id: EMPID })
    //             .then((result) => {
    //                 if (result.deletedCount == 1) {
    //                     response.status(201).json({ message: " Invoice deleted" })
    //                 }
    //                 else
    //                     throw new Error("Invoice not found");
    //             })
    //             .catch((error) => next(error));
    //     })
    //     .catch(err => {
    //         throw new Error("Employee not found");
    //     })  
    //  }
};
  
module.exports.deleteInvoiceByFilter = (request, response, next) => {
    const query = invoiceMW.getQueryToFilterWith(request);

    invoiceSchema.deleteMany(query)
        .then((result) => {
            console.log(result)
            if (result.deletedCount >= 1) {
                response.status(201).json({ message: " Invoice deleted" })
            }
            else
                throw new Error("Invoice not found");
        })
        .catch((error) => next(error));
};

module.exports.displayInvoiceById = (request, response, next) => {
    invoiceSchema.find({ _id: request.params.id })
        .populate({
            path: 'doctor_id',
            select: 'userData',
            model: 'doctors',
            populate: {path: 'userData', select: {fullName:1 }, model: 'users'}
        })
        .populate({ 
            path: "patient_id",
            select: 'patientData',
            model: 'patients',
            populate: {path: 'patientData', select: {fullName:1,email:1,address:1}, model: 'users'}
        })
        .populate({
            path: "employee_id",
            select: 'employeeData',
            model: 'employees',
            populate: {path: 'employeeData', select: {fullName:1}, model: 'users'}
        })
        .populate({path: "appointment_id",select: "date"})
        .populate({path: "clinic_id",select: {clinicName:1}})
        .populate({path: "service_id",select:{name:1}})

        .then((data) => {
            if (data != null) {
                invoiceMW.generateInvoicePDF(data[0]);
                response.status(201).json(data);
           }
            else {
                console.log("null")
                next(new Error({ message: "Id doesn't exist" }));
            }
        })
        .catch(error => next(error));
};