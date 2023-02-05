const express = require('express');
const router = express.Router();

const errorValidator = require("./../Middlewares/errorValidation");
const controller = require('./../Controllers/schedule')
const scheduleValidation = require("../Middlewares/scheduleMW")

router.route("/schedule/:id")
    .get(
        scheduleValidation.paramValidation,
        errorValidator,
        controller.getScheduleById
    )
    .patch(
        scheduleValidation.paramValidation,
        errorValidator,
        scheduleValidation.bodyValidation,
        errorValidator,
        controller.updateSchedule
    )
    .delete(
        scheduleValidation.paramValidation,
        errorValidator,
        controller.deleteSchedule
    )
            
router.route("/schedule")
    .post(
        scheduleValidation.bodyValidation,
        errorValidator,
        controller.newSchedule
    )
    .get(controller.getAllSchedules)

module.exports= router;