
const express = require("express");
const controller = require ("../Controllers/patient");
const patientValidation = require("./../Middlewares/patientMW");
const validator = require("./../Middlewares/errorValidation");
const authenticationMW=require("./../Middlewares/Authorization");
const userValidation = require("./../Middlewares/userMW");

const router= express.Router();

router.route("/patients")
        .get(
                authenticationMW.isDoctorOrAdmin,
                controller.getAllPatients)
        .post(
                authenticationMW.isDoctorOrAdmin,
                patientValidation.patientvalidation,
                validator,
                controller.addPatient)
        .delete(
                authenticationMW.isAdmin,
                patientValidation.patientvalidation,
                validator,
                controller.deletePatients);

router.route("/patients/:id")
        .get(
                authenticationMW.isDoctorOrAdmin,
                patientValidation.paramvalidation,
                validator,
                controller.getPatientByID)
        .delete(
                authenticationMW.isDoctorOrAdmin,
                patientValidation.paramvalidation,
                validator,
                controller.deletePatientById)
        .patch(
                authenticationMW.isPatientOrDoctor,
                patientValidation.paramvalidation,
                validator,
                controller.updatePatient)

                router.route("/patients/email/:email")
                .get(
                        authenticationMW.isPatientOrAdmin,
                        userValidation.userEmailValidation,
                        validator,
                        controller.getPatientByEmail
                )

module.exports = router;