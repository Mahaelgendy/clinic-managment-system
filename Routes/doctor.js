
const express = require('express');
const controller = require('./../Controllers/doctor');
const doctorValidation = require('./../Middlewares/doctorMW');
const userValidation = require("./../Middlewares/userMW");
const scheduleValidation = require("./../Middlewares/scheduleMW");
const validator = require("./../Middlewares/errorValidation");
const authenticationMW=require("./../Middlewares/Authorization")
const router = express.Router();

const upload = require("./../Middlewares/uploadImageMW");

router.route("/doctors/:id")
    .get(
        authenticationMW.isDoctorOrAdmin,
        doctorValidation.paramValidation,
        validator,
        controller.getDoctorById)
    .delete(
        authenticationMW.isAdmin,
        doctorValidation.paramValidation,
        validator,
        controller.deleteDoctor)
    .patch(
<<<<<<< HEAD
        authenticationMW.isDoctorOrAdmin,
=======
        upload.single("profile"),
>>>>>>> 251bd22fd2caacdbd31cb99efd8c763939c92494
        doctorValidation.paramValidation,
        doctorValidation.doctorValidataion,
        userValidation.userbodyValidation,
        validator,
        controller.updateDoctor)


router.route('/doctors')
<<<<<<< HEAD
    .get(
        authenticationMW.isAdmin,
        controller.getAllDoctors)
    .post(
        authenticationMW.isAdmin,
=======
      .get(controller.getAllDoctors)
      .post(
        upload.single("profile"),
>>>>>>> 251bd22fd2caacdbd31cb99efd8c763939c92494
        userValidation.userbodyValidation,
        doctorValidation.doctorValidataion,
        validator,
        controller.addDoctor)


module.exports = router

