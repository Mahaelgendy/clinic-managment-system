const controller = require('../Controllers/Prescription');
const validator = require("../Middlewares/PrescriptionMW")
const express = require('express');

// const validator = require("../Middlewares/")
const router = express.Router();

router.route("/prescription")
    .get(controller.getAllPrescriptions)
    .post(
        validator.prescriptionValidation,
        controller.addPrescription)
    .delete(controller.deleteAllPrescription)
 
router.route("/prescription/:id")
    .get(controller.getPrescriptionById)
    .patch(
        validator.prescriptionValidation,
        controller.updatePrescription
    )

router.route("/prescription/name/:name")
    .get(controller.getAllPrescriptionsForPatient)


router.route("/prescription/dname/:name/pname/:pname")
    .post(
        validator.prescriptionValidation,
        controller.addPrescriptionByPatient)

module.exports = router;

