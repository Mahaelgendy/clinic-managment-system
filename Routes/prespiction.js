const controller = require('../Controllers/Prescription');
const validator = require("../Middlewares/PrescriptionMW");
const errorValidation = require("../Middlewares/errorValidation")
const authenticationMW=require("./../Middlewares/Authorization")
const express = require('express');

// const validator = require("../Middlewares/")
const router = express.Router();

router.route("/prescription")
    .get(authenticationMW.isDoctorOrAdmin,
        controller.getAllPrescriptions)
    .post(
        authenticationMW.isDoctor,
        validator.prescriptionValidation,
        errorValidation,
        controller.addPrescription)
    .delete(
        authenticationMW.isDoctorOrAdmin,
        controller.deleteAllPrescription)
 
router.route("/prescription/:id")
    .get(
        authenticationMW.isDoctorOrAdminOrPatient,
        controller.getPrescriptionById)
    .patch(
        authenticationMW.isDoctorOrAdmin,
        validator.prescriptionValidation,
        errorValidation,
        controller.updatePrescription
    )

router.route("/prescription/name/:name")
    .get(
        authenticationMW.isDoctorOrAdminOrPatient,
        controller.getAllPrescriptionsForPatient)


router.route("/prescription/dname/:name/pname/:pname")
    .post(
        authenticationMW.isDoctorOrAdminOrPatient,
        validator.prescriptionValidation,
        errorValidation,
        controller.addPrescriptionByPatient)

module.exports = router;

