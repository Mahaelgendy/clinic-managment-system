
const express = require('express');
const controller = require('./../Controllers/doctor')
const router = express.Router()

router.route("/doctor/:id")
    .get(controller.getDoctorById)
    .delete(controller.deleteDoctor)
    .patch(controller.updateDoctor);


router.route("/doctor")
      .get(controller.getAllDoctors)
      .post(controller.addDoctor);

module.exports = router

