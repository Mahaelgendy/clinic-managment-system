
const express = require('express');
const controller = require('./../Controllers/doctor');
const doctorValidation = require('./../Middlewares/doctorMW');
const scheduleValidation = require("./../Middlewares/scheduleMW");
const userValidation = require("./../Middlewares/userMW");
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
        doctorValidation.doctorValidataion,
        userValidation.userValidation,
        validator,
        controller.updateDoctor)


router.route('/doctors')
      .get(controller.getAllDoctors)
      .post(
        userValidation.userValidation,
        doctorValidation.doctorValidataion,
        scheduleValidation.bodyValidation,
        validator,
        controller.addDoctor)


module.exports = router

