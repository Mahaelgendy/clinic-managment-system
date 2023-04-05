const controller = require('../Controllers/clinic');
const express = require('express');

const validator = require("../Middlewares/clinicMW")
const authenticationMW=require("./../Middlewares/Authorization")
const router = express.Router();

router.route("/clinic")
    .get(
        authenticationMW.isEmployeeOrAdmin,
        controller.getAllClinics)
    .post(
        authenticationMW.isAdmin,
        validator.clinicValidation,
        controller.addClinic);
    
router.route("/clinic/:id")
    .get(
        authenticationMW.anyUser,
        controller.getClinicById)
    .delete(
        authenticationMW.isAdmin,
        controller.deleteClinicById)
    .patch(
        authenticationMW.isAdmin,
        validator.clinicValidation,
        controller.updateClinic)


module.exports = router;









