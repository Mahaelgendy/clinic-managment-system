
const express = require('express');
const controller = require('./../Controllers/doctor')
const router = express.Router()

router.route("/doctor/:id")
    .get(controller.getDoctorById)
    .delete(controller.deleteDoctor)
    .patch(controller.updateDoctor);

<<<<<<< HEAD
router.post('/doctor' , controller.addDoctor)
=======

router.route("/doctor")
      .get(controller.getAllDoctors)
      .post(controller.addDoctor);
>>>>>>> 01b2643128c99c3c53ce64587fbca55b6320ac24

module.exports = router

