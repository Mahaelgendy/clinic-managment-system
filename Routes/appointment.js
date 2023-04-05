const express = require('express');
const controller = require('./../Controllers/appointment')
const router = express.Router();
const errorValidator = require("./../Middlewares/errorValidation");
const appointmentValidation = require("./../Middlewares/appointmentMW")
const authenticationMW=require("./../Middlewares/Authorization")

router.route("/appointments")
        .get(
                authenticationMW.anyUser,
                controller.getAllAppointments)
        
        .post(
                authenticationMW.isEmployeeOrPatient,
                appointmentValidation.appointmentBodyValidation,
                errorValidator,
                controller.addAppointment)
        .delete(
                authenticationMW.isAdmin,
                controller.deleteAppointmentByFilter);

router.route("/appointments/:id")
        .get(
                authenticationMW.anyUser,
                appointmentValidation.idParamValidation,
                errorValidator,
                controller.getAppointmentbyId
                )
        .delete(
                authenticationMW.isEmployeeOrPatient,
                appointmentValidation.idParamValidation,
                errorValidator,
                controller.deleteAppointmentById
                )
        .patch(
                authenticationMW.isEmployeeOrPatient,
                appointmentValidation.idParamValidation,
                errorValidator,
                appointmentValidation.appointmentBodyValidation,
                errorValidator,
                controller.updateAppointment
                );

router.route("/doctorAppointment/:id")
        .get(
                authenticationMW.isStaff,
                appointmentValidation.idParamValidation,
                errorValidator,
                controller.getAppointmentbyDoctorId
        );

router.route("/clinicAppointment/:id")
        .get(
                authenticationMW.isEmployeeOrAdmin,
                appointmentValidation.idParamValidation,
                errorValidator,
                controller.getAppointmentbyClinicId
        );
router.route("/appointmentsByDate").get(controller.getAppointmentsByDate)
 module.exports= router;