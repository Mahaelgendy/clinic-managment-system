
const express = require('express');
const controller = require('./../Controllers/doctor');
const doctorValidation = require('./../Middlewares/doctorMW');
const validator = require("./../Middlewares/errorValidation");
const router = express.Router();

router.route("/doctors/:id")
    .get(
        doctorValidation.paramValidation,
        validator,
        controller.getDoctorById)
    .delete(
        doctorValidation.paramValidation,
        validator,
        controller.deleteDoctor)
    .patch(
        doctorValidation.paramValidation,
        validator,
        controller.updateDoctor)


router.route('/doctors')
      .get(controller.getAllDoctors)
      .post(
        doctorValidation.doctorValidator,
        validator,
        controller.addDoctor)


module.exports = router

