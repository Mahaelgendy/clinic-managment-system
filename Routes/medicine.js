
const express = require('express');
const controller = require('./../Controllers/medicine');
const medicineValidation = require("./../Middlewares/medicineMW")
const validator = require("./../Middlewares/errorValidation");
const router = express.Router();
const authenticationMW=require("./../Middlewares/Authorization")

router.route('/medicines')
    .get(
        authenticationMW.isDoctorOrAdmin,
        controller.getAllMedicinces)
    .post(
        authenticationMW.isDoctorOrAdmin,
        medicineValidation.bodyValidation,
        validator,
        controller.addMedicine)
    .patch(
        authenticationMW.isDoctorOrAdmin,
        medicineValidation.bodyValidation,
        validator,
        controller.updateMedicines)
        
    .delete(
        authenticationMW.isDoctorOrAdmin,
        controller.deleteMedicine)


module.exports = router