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
        generatePDF(appointmentreport);
      })
      .catch(error => {
        console.error(error);
      });
};
async function generatePDF(allAppointments) {

  let doc = new PDFDocument({ margin: 30, size: 'A4' });
  doc.pipe(fs.createWriteStream("./appointmentsReport.pdf"));

  for(let i =0 ; i < allAppointments.length ; i++){
    let currentAppointment = allAppointments[i];
    console.log(currentAppointment)
    const table = {
      title: `Appointments in date ${currentAppointment._id}`,
      headers: [ "Clinic", "Doctor", "Patient", "From","To", "Status", "reservation Method" ],
      rows: [],
    };
    let appointments = currentAppointment.appointments
    
    appointments.forEach(appointment => {
      table.rows.push(
        [ appointment.clinic.clinic_location.city,
          appointment.doctor.fullname.length> 0 ?  appointment.doctor.fullname[0] : "",
          appointment.patient.fullname.length> 0 ?  appointment.patient.fullname[0]: "",
          dateTimeMW.getTime(appointment.from),
          dateTimeMW.getTime(appointment.from),
          appointment.status,
          appointment.reservationMethod,
        ]);
    });

    // Add the table to the PDF document
    await doc.table(table, { 
      width: 500,
      padding: 5,
      columnSpacing:5
    });
  }
  doc.end();
}

function generateHeader(doc) {
	doc.image('logo.png', 50, 45, { width: 50 })
		.fillColor('#444444')
		.fontSize(20)
		.text('Clinic System', 110, 57)
		.fontSize(10)
		.text('123 Main Street', 200, 65, { align: 'right' })
		.text('New York, NY, 10025', 200, 80, { align: 'right' })
		.moveDown();
}
function generateFooter(doc) {
	doc.fontSize(
		10,
	).text(
		'Payment is due within 15 days. Thank you for your business.',
		50,
		780,
		{ align: 'center', width: 500 },
	);
}