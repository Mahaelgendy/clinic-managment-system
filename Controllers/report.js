const mongoose = require("mongoose");
const appointmentSchema = mongoose.model("appointments");
const invoiceSchema = mongoose.model("invoices");
const fs = require('fs');
const PDFDocument = require("pdfkit-table");
const dateTimeMW = require("./../middlewares/dateTimeMW")

//Appointment Reports
module.exports.getAppointmentReportByDate = (request , response , next)=>{
    appointmentSchema.aggregate([
      {
        $lookup: {
          from: "clinics",
          localField: "clinic_id",
          foreignField: "_id",
          as: "clinic"
        }
      },
      {
        $lookup: {
          from: "doctors",
          localField: "doctor_id",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "userData",
                foreignField: "_id",
                as: "user"
              }
            },
            {
              $project: {
                user: { $arrayElemAt: ["$user", 0] }
              }
            }
          ],
          as: "doctor"
        }
      },
      {
        $lookup: {
          from: "patients",
          localField: "patient_id",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "patientData",
                foreignField: "_id",
                as: "user"
              }
            },
            {
              $project: {
                user: { $arrayElemAt: ["$user", 0] }
              }
            }
          ],
          as: "patient"
        }
      },
      {
        $group: {
          _id: "$date",
          appointments: {
            $push: {
              clinic: { $arrayElemAt: ["$clinic", 0] },
              doctor: { fullname: "$doctor.user.fullName"},
              patient: { fullname: "$patient.user.fullName"},
              employee_id: "$employee_id",
              from: "$from",
              status:"$status",
              reservationMethod:"$reservation_method",
              to: "$to"
            }
          }
        }
      }
    ])
      .then(appointmentreport => {
        response.status(200).json(appointmentreport);
        generatePDF(appointmentreport,true);
      })
      .catch(error => {
        console.error(error);
      });
};
module.exports.getAppointmentReport = (request , response , next)=>{
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
      .populate({path: 'doctor_id', select: 'userData', model: 'doctors', populate: {path: 'userData', select: 'fullName', model: 'users'}})
      .populate({ path: "patient_id" , select: 'patientData', model: 'patients', populate: {path: 'patientData', select: 'fullName', model: 'users'}})
      .populate({path: "employee_id" , select: 'employeeData', model: 'employees', populate: {path: 'employeeData', select: 'fullName', model: 'users'}})
      .then((data)=>{
          response.status(200).json(data);
          generatePDF(data , false)
      })
      .catch((error)=>next(error));
};

//Invoices Reports
module.exports.getInvoiceReportByDate = (request , response , next)=>{
  invoiceSchema.aggregate([
    {
      $lookup: {
        from: "clinics",
        localField: "clinic_id",
        foreignField: "_id",
        as: "clinic"
      }
    },
    {
      $lookup: {
        from: "services",
        localField: "service_id",
        foreignField: "_id",
        as: "service"
      }
    },
    {
      $lookup: {
        from: "appointments",
        localField: "appointment_id",
        foreignField: "_id",
        as: "appointment"
      }
    },
    {
      $lookup: {
        from: "doctors",
        localField: "doctor_id",
        foreignField: "_id",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "userData",
              foreignField: "_id",
              as: "user"
            }
          },
          {
            $project: {
              user: { $arrayElemAt: ["$user", 0] }
            }
          }
        ],
        as: "doctor"
      }
    },
    {
      $lookup: {
        from: "patients",
        localField: "patient_id",
        foreignField: "_id",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "patientData",
              foreignField: "_id",
              as: "user"
            }
          },
          {
            $project: {
              user: { $arrayElemAt: ["$user", 0] }
            }
          }
        ],
        as: "patient"
      }
    },
    {
      $lookup: {
        from: "employees",
        localField: "employee_id",
        foreignField: "_id",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "employeeData",
              foreignField: "_id",
              as: "user"
            }
          },
          {
            $project: {
              user: { $arrayElemAt: ["$user", 0] }
            }
          }
        ],
        as: "employee"
      }
    },
    {
      $group: {
        _id: "$date",
        invoices: {
          $push: {
            clinic: "$clinic",
            service:"$service",
            doctor: { fullname: "$doctor.user.fullName"},
            patient: { fullname: "$patient.user.fullName"},
            employee:{fullname: "$employee.user.fullName"},
            appointment:"$appointment",
            time: "$time",
            status:"$status",
            paymentMethod:"$paymentMethod",
            paymentStatus:"$paymentStatus",
            totalCost:"$totalCost",
            actualPaid:"$actualPaid",
          }
        }
      }
    }
  ])
    .then(invoiceReport => {
      response.status(200).json(invoiceReport);
      console.log(invoiceReport);
      generateInvoicePDF(invoiceReport,true);
    })
    .catch(error => {
      console.error(error);
    });
};
module.exports.getInvoiceReport = (request , response , next)=>{
  const query = {};
  if (request.query.clinicId) query.clinic_id = Number(request.query.clinicId);
  if (request.query.doctorId) query.doctor_id = Number(request.query.doctorId);
  if (request.query.patientId) query.patient_id = Number(request.query.patientId);
  if (request.query.employeeId) query.employee_id = Number(request.query.employeeId);
  if (request.query.appointmentId) query.appointment_id = Number(request.query.appointmentId);
  if (request.query.date) query.date = request.query.date;
  if (request.query.paymentStatus) query.paymentStatus = request.query.paymentStatus;
  if (request.query.paymentMethod) query.paymentMethod = request.query.paymentMethod;

  invoiceSchema.find(query)
      .populate({ path: "clinic_id" ,select: 'clinicName'})
      .populate({ path: "service_id" ,select: 'name'})
      .populate({path: "appointment_id", select:'date'})
      .populate({path: 'doctor_id', select: 'userData', model: 'doctors', populate: {path: 'userData', select: 'fullName', model: 'users'}})
      .populate({ path: "patient_id" , select: 'patientData', model: 'patients', populate: {path: 'patientData', select: 'fullName', model: 'users'}})
      .populate({path: "employee_id" , select: 'employeeData', model: 'employees', populate: {path: 'employeeData', select: 'fullName', model: 'users'}})
      .then((data)=>{
          response.status(200).json(data);
          generateInvoicePDF(data,false);
        })
      .catch((error)=>next(error));
};


async function generatePDF(allAppointments,isByDate) {
  let doc = new PDFDocument({ margin: 30, size: 'A4' });
  let header=[]
  let table = {};
  doc.pipe(fs.createWriteStream("./appointmentsReport.pdf"));
  doc.fontSize(18).text("Appointments Report", { align: "center" })
    .moveDown();

  if (isByDate)
    header=[ "Clinic", "Doctor", "Patient", "From","To", "Status", "reservation Method" ]
  else
    header=[ "Date","Clinic", "Doctor", "Patient", "From","To", "Status", "reservation Method" ]

  for(let i =0 ; i < allAppointments.length ; i++){
    let currentAppointment = allAppointments[i];
    
    if (isByDate){
      table = {
        title: `Appointments in date ${currentAppointment._id}`,
        headers: header,
        rows: [],
      };
      let appointments = currentAppointment.appointments
      appointments.forEach(appointment => {
        table.rows.push(
          [ 
            appointment.clinic.clinic_location.city,
            appointment.doctor.fullname.length> 0 ?  appointment.doctor.fullname[0] : "",
            appointment.patient.fullname.length> 0 ?  appointment.patient.fullname[0]: "",
            dateTimeMW.getTime(appointment.from),
            dateTimeMW.getTime(appointment.to),
            appointment.status,
            appointment.reservationMethod,
          ]);
      });
    }
    else{
      table = {
        title: `Appointments`,
        headers: header,
        rows: [],
      };
        table.rows.push(
          [ 
            currentAppointment.date,
            currentAppointment.clinic_id != null ?  currentAppointment.clinic_id.clinic_location.city : "",
            currentAppointment.doctor_id.userData != null ?  currentAppointment.doctor_id.userData.fullName : "",
            currentAppointment.patient_id.patientData != null ? currentAppointment.patient_id.patientData.fullName : "",
            dateTimeMW.getTime(currentAppointment.from),
            dateTimeMW.getTime(currentAppointment.to),
            currentAppointment.status,
            currentAppointment.reservation_method,
          ]);
    }

    // Add the table to the PDF document
    await doc.table(table, { 
      width: 500,
      padding: 5,
      columnSpacing:5
    });
  }
  doc.end();
}

async function generateInvoicePDF(allInvoices,isByDate) {
  let doc = new PDFDocument({ margin: 30, size: 'A4' });
  let header=[]
  let table = {};
  doc.pipe(fs.createWriteStream("./invoiceReport.pdf"));
  doc.fontSize(18).text("Invoice Report", { align: "center" })
    .moveDown();

  if (isByDate)
    header=[ "Clinic","Service", "Doctor", "Patient","Employee","appointment Date", "Status", "Reservation Method","Time","Total Cost","Actual Paid" ]
  else
    header=[ "Date","Clinic","Service", "Doctor", "Patient","Employee","appointment Date", "Status", "Reservation Method","Time","Total Cost","Actual Paid"]

  for(let i =0 ; i < allInvoices.length ; i++){
    let currentInvoice = allInvoices[i];
    
    if (isByDate){
      table = {
        title: `Invoices in date ${currentInvoice._id}`,
        headers: header,
        rows: [],
      };
      let invoices = currentInvoice.invoices
      invoices.forEach(invoice => {
        table.rows.push(
          [ 
            invoice.clinic.length >0 ? invoice.clinic[0].clinicName: "",
            invoice.service.length>0 ? invoice.service[0].name : "",
            invoice.doctor.fullname.length> 0 ?  invoice.doctor.fullname[0] : "",
            invoice.patient.fullname.length> 0 ?  invoice.patient.fullname[0]: "",
            invoice.employee.fullname.length> 0 ?  invoice.employee.fullname[0]: "",
            invoice.appointment.length> 0 ?  invoice.appointment[0].date: "",
            invoice.paymentStatus,
            invoice.paymentMethod,
            invoice.time,
            invoice.totalCost,
            invoice.actualPaid
          ]);
      });
    }
    else{
      table = {
        title: `Invoices`,
        headers: header,
        rows: [],
      };
        table.rows.push(
          [ 
            currentInvoice.date,
            currentInvoice.clinic_id != null ?  currentInvoice.clinic_id.clinicName : "",
            currentInvoice.service_id != null ?  currentInvoice.service_id.name : "",
            currentInvoice.doctor_id.userData != null ?  currentInvoice.doctor_id.userData.fullName : "",
            currentInvoice.patient_id.patientData != null ? currentInvoice.patient_id.patientData.fullName : "",
            currentInvoice.employee_id.employeeData != null ? currentInvoice.employee_id.employeeData.fullName : "",
            currentInvoice.appointment_id != null ? currentInvoice.appointment_id.date : "",
            currentInvoice.paymentStatus,
            currentInvoice.paymentMethod,
            currentInvoice.time,
            currentInvoice.totalCost,
            currentInvoice.actualPaid
          ]);
    }

    // Add the table to the PDF document
    await doc.table(table, { 
      width: 500,
      padding: 5,
      columnSpacing:5
    });
  }
  doc.end();
}