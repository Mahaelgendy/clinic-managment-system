const controller = require('../Controllers/report');
const express = require('express');
const router = express.Router();
const authenticationMW=require("./../Middlewares/Authorization")


router.route("/appointmentReport")
    .get(
        authenticationMW.isEmployeeOrAdmin,
        controller.getAppointmentReportByDate);

module.exports = router;