const express = require('express');
const controller = require('./../Controllers/appointment')
const router = express.Router();
const errorValidator = require("./../Middlewares/errorValidation");
const appointmentValidation = require("./../Middlewares/appointmentMW")
const authenticationMW=require("./../Middlewares/Authorization")

router.route("/appointments")
        .get(
                authenticationMW.isAdmin,
                controller.getAllAppointments)
        
        .post(
                // authenticationMW.isPatientOrAdmin,
                appointmentValidation.appointmentBodyValidation,
                errorValidator,
                controller.addAppointment)
        .delete(controller.deleteAppointmentByFilter);

router.route("/appointments/:id")
        .get(
                authenticationMW.anyUser,
                appointmentValidation.idParamValidation,
                errorValidator,
                controller.getAppointmentbyId
                )
        .delete(
                authenticationMW.isStaff,
                appointmentValidation.idParamValidation,
                errorValidator,
                controller.deleteAppointmentById
                )
        .patch(
                authenticationMW.isStaff,
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
        
 module.exports= router;