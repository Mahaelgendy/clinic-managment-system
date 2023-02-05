const express = require('express');
const controller = require('./../Controllers/schedule')
const router = express.Router();

router.route("/schedule/:id")
    .get(
        controller.getScheduleByDoctorId
)
router.route("/schedule")
.post(
    controller.newSchedule
)       

module.exports= router;