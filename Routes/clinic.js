const controller = require('../Controllers/clinic');
const express = require('express');

const validator = require("../Middlewares/clinicMW")
const router = express.Router();

router.route("/clinic")
    .get(controller.getAllClinics)
    .post(
        validator.clinicValidation,
        controller.addClinic);
    
router.route("/clinic/:id")
    // .get(controller.getClinicById)
    .delete(controller.deleteClinicById)
    .patch(
        validator.clinicValidation,
        controller.updateClinic)


module.exports = router;









