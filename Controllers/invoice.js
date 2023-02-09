const { request, response } = require("express");
const mongoose = require("mongoose");
const stripe = require("stripe")("sk_test_51MYW00L4FZm4LCWYTDkVw2JR6AYkNpcMdotgqSLDCdbiSeaCIz51U1QrcOT3dKepTfgjIZbSzdT3gwIjFa0mdG2W00X1uRIqgn");

const invoiceMW=require('../Models/invoiceModel');
const dateTimeMW = require("./../middlewares/dateTimeMW")
//const onlinePayment=require("./../Middlewares/payment")
const { jsPDF } = require("jspdf");

const invoiceSchema = mongoose.model("invoices");
const DoctorSchema = mongoose.model('doctors');
const appointmentSchema= mongoose.model('appointments');
const employeeSchema = mongoose.model("employees");
const clinicSchema= mongoose.model('clinics');
const patientSchema= mongoose.model('patients');
const serviceSchema= mongoose.model('services');

const path = require("path");

module.exports.getAllInvoices = (request, response, next) => {

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

    invoiceSchema.find(query)
    .populate({ path: "clinic_id" })
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
                //invoiceMW.sortInvoice(filteredData,request.query);
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
            if (data != null) {
                if ((request.role == 'employee') && (request.id == data.employee_id.employeeData._id)) {
                    response.status(200).json(data);
                }
                else if (request.role == 'admin') {
                    response.status(200).json(data);
                }
                else{
                    response.json({message:"You aren't authourized to see this data"});
                }
            }

            else  {
                console.log("null")
                response.json({message:"Id doesn't exist"});
            }
        })
        .catch(error => next(error));
};

module.exports.addInvoice = async(request, response, next) => {
    const doctorExist=await DoctorSchema.findOne({_id:request.body.doctorId})
    const clinicExist=await clinicSchema.findOne({_id:request.body.clinicId})
    const serviceExist=await serviceSchema.findOne({_id:request.body.serviceId})
    const patientExist = await patientSchema.findOne({ _id: request.body.patientId })
    const employeeExist=await employeeSchema.findOne({_id:request.body.employeeId})
    const appointmentExist = await appointmentSchema.findOne({ _id: request.body.appointmentId })

    // if ((!doctorExist)||(!clinicExist)||(!serviceExist)||(!patientExist)||(!employeeExist)||(!appointmentExist)) {
    //     return response.status(400).json({message:"Check your data "})
    // }

    function totalCost() {
       // console.log(doctorExist.price) 
        //console.log(serviceExist.salary)
      return doctorExist.price+serviceExist.salary
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
        totalCost: totalCost(),
        actualPaid: request.body.actualPaid,
        date: dateTimeMW.getDateFormat(new Date()),
        time: dateTimeMW.getTime(new Date()),

    });
    let savedinvoice = await newInvoice.save()
    
    let paymentMethod = request.body.paymentMethod;
    
       if (paymentMethod == 'Credit Card') {
        let createdToken= await stripe.tokens.create({
               card: {
                   number: '4242424242424242',
                   exp_month: 03,
                   exp_year: 2030,
                   cvc: '737'
               }
           });
           let charging= await stripe.charges.create({
            amount: 2000,
            currency: "usd",
            description: "An example charge",
            source: createdToken.id
           })
           console.log(charging.id)

           
    }
    response.status(201).json(savedinvoice);
    // try {
    //     let res = await newInvoice.save()
    //     console.log(res)
    //     let paymentMethod = request.body.paymentMethod;
    //     if (paymentMethod == 'Credit Card') {

    //         console.log("credit")
    //         let charge = await onlinePayment.payment()

    //         console.log(charge)
    //     }
    // }
    // catch (error) {
    //     next(error);
    // }
      //  .then( result => {
          
       // })
       // .catch(error => next(error));
};


module.exports.updateInvoice = async (request, response, next) => {
   
    await employeeSchema.findOne({ "employeeData": request.id })
        .then(data => {
            //  console.log("yes")
            //console.log(data)
            console.log(data._id)
            let EMPID = data._id
            console.log("emp" + EMPID)
            // console.log(request.id)
            invoiceSchema.findOneAndUpdate({
                _id: request.params.id,
                employee_id: EMPID
            },
                {
                    $set: {
                        clinic_id: request.body.clinicId,
                        doctor_id: request.body.doctorId,
                        service_id: request.body.serviceId,
                        patient_id: request.body.patientId,
                        // employee_id: request.body.employeeId,
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
                   
                // if (result.modifiedCount==1) {
                //     response.status(201).json({ message: "Invoice updated" })
                // }
                // else if(result.modifiedCount==0) {
                //     response.status(201).json({ message: "You haven't changed any data" })
                // }
                else if(result==null)
                    throw new Error("Invoice not found");
            })
                
                .catch(error => next(error));

        })
        .catch(err => {
            throw new Error("employee not found");
        })
};

module.exports.deleteInvoice = (request, response, next) => {

    if (request.role == 'admin') {
        invoiceSchema.deleteOne({ _id: request.params.id })
            .then((result) => {
            
                if (result.deletedCount == 1) {
                    response.status(201).json({ message: " Invoice deleted" })
                }
                else
                    throw new Error("Invoice not found");
            })
            .catch((error) => next(error));
    }

    else if (request.role == "employee") {
         employeeSchema.findOne({ "employeeData": request.id })
        .then(data => {
            // console.log("yes")
            // console.log(data)
            // console.log(data._id)
            let EMPID = data._id
            // console.log(DOCID)
            // console.log(request.id)

            invoiceSchema.deleteOne({ _id: request.params.id, employee_id: EMPID })
                .then((result) => {
                    if (result.deletedCount == 1) {
                        response.status(201).json({ message: " Invoice deleted" })
                    }
                    else
                        throw new Error("Invoice not found");
                })
                .catch((error) => next(error));
        })
        .catch(err => {
            throw new Error("Employee not found");
        })  
    }
};
  
module.exports.deleteInvoiceByFilter = (request, response, next) => {
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
            path: "doctor_id",
            select: { userData:1,_id:0 },
            model: "doctors",
            populate: { path: "userData", select: {fullName:1,_id:0 }, model: "users" }
        })
        .populate({
            path: "patient_id",
            select: { userData:1,_id:0 },
            model: "doctors",
            populate: { path: "userData", select: {fullName:1,email:1,address:1,_id:0 }, model: "users" }
        })
        .populate({ 
            path: "employee_id",
            select: {userData:1,_id:0 },
            model: "doctors",
            populate: { path: "userData", select: {fullName:1,_id:0 }, model: "users" }
        })
        .populate({path: "appointment_id",select: "date"})
        .populate({path: "clinic_id",select: {clinicName:1,_id:0}})
        .populate({path: "service_id", select: { name: 1, _id: 0 } })
        
        .then((data) => {
            if (data != null) {
                generateInvoicePDF(data[0]);
                response.status(201).json(data);
           }
            else {
                console.log("null")
                next(new Error({ message: "Id doesn't exist" }));
            }
        })
        .catch(error => next(error));
};

function generateInvoicePDF(invoice){
    // Initialize the PDF document
    let parientAddress =invoice.patient_id != null ? invoice.patient_id.userData != null ? invoice.patient_id.userData.address: "" : ""
    let patientDate = invoice.patient_id != null ? invoice.patient_id.userData != null ? invoice.patient_id.userData : "" : "";
    const doc = new jsPDF();

    doc.setFont("helvetica","bold");
    doc.setFontSize(30);
    doc.setTextColor(0, 0, 139);
    doc.text("Invoice",19, 30);

    doc.setFont("helvetica","bold");
    doc.setFontSize(15);
    doc.setTextColor(0, 0, 139);
    doc.text("Invoice To:",20, 40, null, null);

    doc.setFont("helvetica","normal");
    doc.setFontSize(10);
    doc.setTextColor(0,0,0)
    doc.text(patientDate.fullName,20, 47, null, null);
    doc.text(parientAddress.building+ " " + parientAddress.city+ " " + parientAddress.street ,20, 52, null, null);
    doc.text(patientDate.email,20, 58, null, null);


    doc.setFont("helvetica","bold");
    doc.setFontSize(15);
    doc.setTextColor(0, 0, 139);
    doc.text("Invoice Details:",130, 40, null, null,"left");

    doc.setFont("helvetica","normal");
    doc.setFontSize(10);
    doc.setTextColor(0,0,0)
    doc.text("Inovice No. "+ invoice._id ,130, 47, null, null,"left");
    doc.text("Invoice Date : "+ invoice.date ,130, 52, null, null,"left");
    doc.text("Invoice time : " + invoice.time,130, 57, null, null,"left");

    let cliniName = invoice.clinic_id != null ? invoice.clinic_id.clinicName : "";
    let serviceName = invoice.service_id != null ? invoice.service_id.name : "";
    let doctorName = invoice.doctor_id != null ? (invoice.doctor_id.userData != null ? invoice.doctor_id.userData.fullName: "") : "";

    var header = ["Clinic","Service","Doctor","Cost","Paid"];
    var data = [  
    [cliniName, serviceName, doctorName, invoice.totalCost.toString(), invoice.actualPaid.toString()],
    ];

    doc.setFillColor(0, 0, 139);
    doc.rect(15, 92, 180, 10, "F");
    doc.setFontSize(16);
    doc.setFontSize(15);
    for (var i = 0; i < header.length; i++) {
    doc.setTextColor(255, 255, 255);
    doc.text(header[i],25 + i * 35,100);
    }

    doc.setFontSize(12,"normal");
    doc.setTextColor(0, 0, 0);
    for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
        doc.text(25 + j *35, 120 + i * 20, data[i][j]);
    }
    }
    doc.line(15,120 + data.length * 20, 195, 120 + data.length * 20);

    let remainig = invoice.totalCost- invoice.actualPaid;
    doc.setFont("helvetica","normal");
    doc.setFontSize(15);
    doc.setTextColor(0,0,0)
    doc.text("Sub Total = " + invoice.totalCost.toString() ,150, 150, null, null,"left");
    doc.text("Tax %  = 0.00%" ,150, 157, null, null,"left");
    doc.text("Grand Total = " + invoice.totalCost.toString() ,150, 162, null, null,"left");
    doc.text("Remaning = " + remainig.toString() ,150, 167, null, null,"left");

    // Save the PDF document
    doc.save("invoice.pdf");
}