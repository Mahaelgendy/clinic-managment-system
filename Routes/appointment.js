const express = require('express');
const controller = require('./../Controllers/appointment')
const router = express.Router();

router.route("/appointments")
        .get(controller.getAllAppointments)
        .post( controller.addAppointment);

router.route("/appointments/:id")
        .get(controller.getAppointmentbyId)
        .delete(controller.deleteAppointmentById)
        .patch(controller.updateAppointment);

router.route("/doctorAppointment/:doctorId")
        .get(controller.getAppointmentbyDoctorId);

router.route("/clinicAppointment/:clinicId")
        .get(controller.getAppointmentbyClinicId);
        
 module.exports= router;