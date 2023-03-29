const express = require('express');
const router = express.Router();

const errorValidator = require("./../Middlewares/errorValidation");
const controller = require('./../Controllers/schedule')
const scheduleValidation = require("../Middlewares/scheduleMW")
const authenticationMW=require("./../Middlewares/Authorization")

router.route("/schedule/:id")
    .get(
        // authenticationMW.isDoctorOrAdmin,
        scheduleValidation.paramValidation,
        errorValidator,
        controller.getScheduleById
    )
    .patch(
        // authenticationMW.isDoctorOrAdmin,
        scheduleValidation.paramValidation,
        errorValidator,
        scheduleValidation.bodyValidation,
        errorValidator,
        controller.updateSchedule
    )
    .delete(
        // authenticationMW.isDoctorOrAdmin,
        scheduleValidation.paramValidation,
        errorValidator,
        controller.deleteScheduleById
    )
            
router.route("/schedule")
    .post(
        // authenticationMW.isDoctorOrAdmin,
        scheduleValidation.bodyValidation,
        errorValidator,
        controller.newSchedule
    )
    .delete(
        controller.deleteScheduleByFilter
    )
    .get(
        // authenticationMW.isDoctorOrAdmin,
        controller.getAllSchedules)

module.exports= router;