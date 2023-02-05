
const express = require('express');
const controller = require('./../Controllers/doctor');
const doctorValidation = require('./../Middlewares/doctorMW');
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
        userValidation.userbodyValidation,
        validator,
        controller.updateDoctor)


router.route('/doctors')
      .get(controller.getAllDoctors)
      .post(
        userValidation.userbodyValidation,
        doctorValidation.doctorValidataion,
<<<<<<< HEAD
        scheduleValidation.bodyValidation,
=======
>>>>>>> da5dad2bc08853c7f2b3e39a2e89ea33f723b5c6
        validator,
        controller.addDoctor)


module.exports = router

