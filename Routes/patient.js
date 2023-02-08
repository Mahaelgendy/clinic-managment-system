
const express = require("express");
const controller = require ("../Controllers/patient");
const patientValidation = require("./../Middlewares/patientMW");
const validator = require("./../Middlewares/errorValidation");
const authenticationMW=require("./../Middlewares/Authorization")

const router= express.Router();

router.route("/patients")
        .get(
                authenticationMW.isAdmin,
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
                authenticationMW.isDoctorOrAdminOrPatient,
                patientValidation.paramvalidation,
                validator,
                controller.getPatientByID)
        .delete(
                authenticationMW.isDoctorOrAdmin,
                patientValidation.paramvalidation,
                validator,
                controller.deletePatientById)
        .patch(
                authenticationMW.isDoctor,
                patientValidation.paramvalidation,
                validator,
                controller.updatePatient)
module.exports = router;