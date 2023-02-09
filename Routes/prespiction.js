const controller = require('../Controllers/Prescription');
const validator = require("../Middlewares/PrescriptionMW");
const errorValidation = require("../Middlewares/errorValidation")
const authenticationMW=require("./../Middlewares/Authorization")
const express = require('express');

// const validator = require("../Middlewares/")
const router = express.Router();

router.route("/prescription")
    .get(authenticationMW.isDoctorOrAdminOrPatient,
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
        authenticationMW.isDoctor,
        validator.prescriptionValidation,
        errorValidation,
        controller.updatePrescription
    )
    .delete(authenticationMW.isDoctorOrAdmin,
        controller.deletePrescriptionById)

router.route("/prescription/name/:name")
    .get(
        authenticationMW.isDoctorOrAdminOrPatient,
        controller.getAllPrescriptionsForPatient)


router.route("/prescription/dname/:name/pname/:pname")
    .post(
        authenticationMW.isDoctor,
        validator.prescriptionValidation,
        errorValidation,
        controller.addPrescriptionByPatient)

module.exports = router;

