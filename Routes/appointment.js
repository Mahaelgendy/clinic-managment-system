const express = require('express');
const controller = require('./../Controllers/appointment')
const router = express.Router();
const errorValidator = require("./../Middlewares/errorValidation");
const appointmentValidation = require("./../Middlewares/appointmentMW")

router.route("/appointments")
        .get(controller.getAllAppointments)
        .post(
                appointmentValidation.appointmentBodyValidation,
                errorValidator,
                controller.addAppointment)
        .delete(controller.deleteAppointmentByFilter);

router.route("/appointments/:id")
        .get(
                appointmentValidation.idParamValidation,
                errorValidator,
                controller.getAppointmentbyId
                )
        .delete(
                appointmentValidation.idParamValidation,
                errorValidator,
                controller.deleteAppointmentById
                )
        .patch(
                appointmentValidation.idParamValidation,
                errorValidator,
                appointmentValidation.appointmentBodyValidation,
                errorValidator,
                controller.updateAppointment
                );

router.route("/doctorAppointment/:id")
        .get(
                appointmentValidation.idParamValidation,
                errorValidator,
                controller.getAppointmentbyDoctorId
        );

router.route("/clinicAppointment/:id")
        .get(
                appointmentValidation.idParamValidation,
                errorValidator,
                controller.getAppointmentbyClinicId
        );
        
 module.exports= router;