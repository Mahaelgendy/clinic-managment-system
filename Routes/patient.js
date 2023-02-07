
const express = require("express");
const controller = require ("../Controllers/patient");
const patientValidation = require("./../Middlewares/patientMW");
const validator = require("./../Middlewares/errorValidation");
const router= express.Router();

router.route("/patients")
        .get(
                patientValidation.patientvalidation,
                validator,
                controller.getAllPatients)
        .post(
                patientValidation.patientvalidation,
                validator,
                controller.addPatient)
        .delete(
                patientValidation.patientvalidation,
                validator,
                controller.deletePatients);

router.route("/patients/:id")
        .get(
                patientValidation.paramvalidation,
                validator,
                controller.getPatientByID)
        .delete(
                patientValidation.paramvalidation,
                validator,
                controller.deletePatientById)
        .patch(
                patientValidation.paramvalidation,
                validator,
                controller.updatePatient)
module.exports = router;