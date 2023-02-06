const controller = require('../Controllers/report');
const express = require('express');
const router = express.Router();

router.route("/appointmentReportbyDate")
    .get(controller.getAppointmentReportByDate);

router.route("/appointmentReport")
    .get(controller.getAppointmentReport);

router.route("/invoiceReport")
    .get(controller.getInvoiceReport);

router.route("/invoiceReportbyDate")
    .get(controller.getInvoiceReportByDate);
module.exports = router;
