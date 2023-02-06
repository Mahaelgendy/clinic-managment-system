const controller = require('../Controllers/report');
const express = require('express');
const router = express.Router();

router.route("/appointmentReportbyDate")
    .get(controller.getAppointmentReportByDate);

router.route("/appointmentReport")
    .get(controller.getAppointmentReport);
module.exports = router;