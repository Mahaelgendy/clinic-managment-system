const {body , param} = require("express-validator")
const { jsPDF } = require("jspdf");

exports.bodyValidation = [
    body("doctorId").isInt().notEmpty().withMessage("Doctor ID must be Numeric and required"),
    body("patientId").isInt().notEmpty().withMessage("Patient ID must be Numeric and required"),
    body("employeeId").isInt().notEmpty().withMessage("Employee ID must be Numeric and required"),
    body("appointmentId").isInt().notEmpty().withMessage("Appointment ID must be Numeric and required"),
    body("clinicId").isInt().notEmpty().withMessage("ClinicID must be Numeric and required"),
    body("paymentMethod").isIn(["Cash","Credit Card"]).notEmpty().withMessage("Payment method should be Either Cash or Credit card"),
    body("paymentStatus").isIn(["Total amount","Partial with insurance"]).notEmpty().withMessage("Payment status should be Either Total amount or Partial with insurance"),
    body("totalCost").isInt().notEmpty().withMessage("Total cost must be Numeric and required"),
    body("actualPaid").isInt().notEmpty().withMessage("Actual paid money must be Numeric and required"),
]

exports.paramValidation = [
    param('id').isInt().withMessage("Id should be interger")
]

module.exports.getQueryToFilterWith=(request)=> {
    const query = {};
    if (request.query.doctor_id)
        query.doctor_id = Number(request.query.doctor_id);
    if (request.query.patient_id)
        query.patient_id = Number(request.query.patient_id);
    if (request.query.employee_id)
        query.employee_id = Number(request.query.employee_id);
    if (request.query.appointment_id)
        query.appointment_id = Number(request.query.appointment_id);
    if (request.query.clinic_id)
        query.clinic_id = Number(request.query.clinic_id);
    if (request.query.service_id)
        query.service_id = Number(request.query.service_id);
    if (request.query.paymentMethod)
        query.paymentMethod = request.query.paymentMethod;
    if (request.query.paymentStatus)
        query.paymentStatus = request.query.paymentStatus;
    if (request.query.date)
        query.date = request.query.date;
    return query;
}
module.exports.sortInvoice = (data,query)=>{
    let sortBy = query.sortBy||'date';
    let order = query.order ||"asc";
    let orderValue = order ==="asc"? 1:-1

    if (sortBy=='doctorName' || sortBy == 'doctorname'){
        data.sort((a, b) => {
            if (a.doctor_id.userData.fullName < b.doctor_id.userData.fullName) {
                return -1*orderValue;
            }
            if (a.doctor_id.userData.fullName > b.doctor_id.userData.fullName) {
                return 1*orderValue;
            }
            return 0;
        });
    }
    else if (sortBy=='patientName' || sortBy == 'patientname'){
        data.sort((a, b) => {
            if (a.patient_id.patientData.fullName < b.patient_id.patientData.fullName) {
                return -1*orderValue;
            }
            if (a.patient_id.patientData.fullName > b.patient_id.patientData.fullName) {
                return 1*orderValue;
            }
            return 0;
        });
    }
    else if (sortBy=='employeeName' || sortBy == 'employeename'){
        data.sort((a, b) => {
            if (a.employee_id.employeeData.fullName < b.employee_id.employeeData.fullName) {
                return -1*orderValue;
            }
            if (a.employee_id.employeeData.fullName > b.employee_id.employeeData.fullName) {
                return 1*orderValue;
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

module.exports.generateInvoicePDF =(invoice)=>{
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