const controller = require('../Controllers/report');
const express = require('express');
const router = express.Router();
const authenticationMW=require("./../Middlewares/Authorization")


router.route("/appointmentReport")
    .get(
        authenticationMW.isEmployeeOrAdmin,
        controller.getAppointmentReportByDate);

router.route("/appointmentReport")
    .get(
        authenticationMW.isEmployeeOrAdmin,
        controller.getAppointmentReport);

router.route("/invoiceReport")
    .get(authenticationMW.isEmployeeOrAdmin,
        controller.getInvoiceReport);

router.route("/invoiceReportbyDate")
    .get(authenticationMW.isEmployeeOrAdmin,
        controller.getInvoiceReportByDate);
module.exports = router;
