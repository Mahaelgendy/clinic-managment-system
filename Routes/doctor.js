
const express = require('express');
const controller = require('./../Controllers/doctor');
const doctorValidation = require('./../Middlewares/doctorMW');
const userValidation = require("./../Middlewares/userMW");
const scheduleValidation = require("./../Middlewares/scheduleMW");
const validator = require("./../Middlewares/errorValidation");
const authenticationMW=require("./../Middlewares/authenticationMW")
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
        userValidation.userbodyValidation,
        validator,
        controller.updateDoctor)


router.route('/doctors')
      .get(controller.getAllDoctors)
      .post(
        userValidation.userbodyValidation,
        scheduleValidation.bodyValidation,
        validator,
        controller.addDoctor)


module.exports = router

