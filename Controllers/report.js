const mongoose = require("mongoose");
const appointmentSchema = mongoose.model("appointments");
const fs = require('fs');
const PDFDocument = require("pdfkit-table");
const dateTimeMW = require("./../middlewares/dateTimeMW")


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
  const sort = req.query.sort || 'date';
  if (request.query.clinicId) query.clinic_id = Number(request.query.clinicId);
  if (request.query.doctorId) query.doctor_id = Number(request.query.doctorId);
  if (request.query.patientId) query.patient_id = Number(request.query.patientId);
  if (request.query.employeeId) query.employee_id = Number(request.query.employeeId);
  if (request.query.date) query.date = request.query.date;
  if (request.query.status) query.status = request.query.status;
  if (request.query.reservationMethod) query.reservation_method = request.query.reservationMethod;

  appointmentSchema.find(query).sort(sort).populate({ path: "clinic_id"})
      .populate({path: 'doctor_id', select: 'userData', model: 'doctors', populate: {path: 'userData', select: 'fullName', model: 'users'}})
      .populate({ path: "patient_id" , select: 'patientData', model: 'patients', populate: {path: 'patientData', select: 'fullName', model: 'users'}})
      .populate({path: "employee_id" , select: 'employeeData', model: 'patients', populate: {path: 'employeeData', select: 'fullName', model: 'users'}})
      .then((data)=>{
          response.status(200).json(data);
          generatePDF(data , false)
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