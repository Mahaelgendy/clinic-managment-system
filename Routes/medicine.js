
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

    .delete(
        authenticationMW.isDoctorOrAdmin,
        controller.deleteMedicine)
    
    .patch(
        authenticationMW.isDoctorOrAdmin,
        medicineValidation.bodyValidation,
        validator,
        controller.updateMedicines)

router.route("/medicines/:id")
.get(
        authenticationMW.isDoctorOrAdmin,
        validator,
        controller.getById
        )
module.exports = router