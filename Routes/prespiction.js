const controller = require('../Controllers/Prescription');
const validator = require("../Middlewares/PrescriptionMW")
const express = require('express');

// const validator = require("../Middlewares/")
const router = express.Router();

router.route("/prescription")
    .get(controller.getAllPrescriptions)
    .post(
        validator.prescriptionValidation,
        controller.addPrescription);
    
router.route("/prescription/:id")
    .get(controller.getPrescriptionById)
    .delete(controller.deletePrescriptionById)
    .patch(
        validator.prescriptionValidation,
        controller.updatePrescription)

module.exports = router;

