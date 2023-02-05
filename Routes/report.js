const controller = require('../Controllers/report');
const express = require('express');
const router = express.Router();

router.route("/appointmentReport")
    .get(controller.getAppointmentReportByDate);

module.exports = router;