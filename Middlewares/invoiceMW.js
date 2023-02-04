const {body , param} = require("express-validator")

exports.invoiceValidation = [
    body("_id").isInt().notEmpty().withMessage("ID is Numeric and required"),
    body("doctor_id").isInt().notEmpty().withMessage("Doctor ID must be Numeric and required"),
    body("patient_id").isInt().notEmpty().withMessage("Patient ID must be Numeric and required"),
    body("employee_id").isInt().notEmpty().withMessage("Employee ID must be Numeric and required"),
    body("appointment_id").isInt().notEmpty().withMessage("Appointment ID must be Numeric and required"),
    body("clinic_id").isInt().notEmpty().withMessage("ClinicID must be Numeric and required"),
    body("paymentMethod").isIn(["Cash","Credit Card"]).notEmpty().withMessage("Payment method should be Either Cash or Credit card"),
    body("paymentStatus").isIn(["Total amount","Partial with insurance"]).notEmpty().withMessage("Payment status should be Either Total amount or Partial with insurance"),
    body("totalCost").isInt().notEmpty().withMessage("Total cost must be Numeric and required"),
    body("actualPaid").isInt().notEmpty().withMessage("Actual paid money must be Numeric and required"),
    // body("date").isString().notEmpty().withMessage("Date must be string in format YYYY-MM-DD"),
    // body("time").isString().notEmpty().withMessage("Time must be string in format hh:mm:ss"),

]