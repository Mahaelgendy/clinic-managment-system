const {body , param} = require("express-validator")

exports.bodyValidation = [
    body("doctorId").isInt().notEmpty().withMessage("Doctor ID must be Numeric and required"),
    body("patientId").isInt().notEmpty().withMessage("Patient ID must be Numeric and required"),
    body("employeeId").isInt().notEmpty().withMessage("Employee ID must be Numeric and required"),
    body("appointmentId").isInt().notEmpty().withMessage("Appointment ID must be Numeric and required"),
    body("clinicId").isInt().notEmpty().withMessage("ClinicID must be Numeric and required"),
    body("paymentMethod").isIn(["Cash","Credit Card"]).notEmpty().withMessage("Payment method should be Either Cash or Credit card"),
    body("paymentStatus").isIn(["Total amount","Partial with insurance"]).notEmpty().withMessage("Payment status should be Either Total amount or Partial with insurance"),
    body("totalCost").isInt().notEmpty().withMessage("Total cost must be Numeric and required"),
    body("actualPaid").isInt().notEmpty().withMessage("Actual paid money must be Numeric and required"),
]

exports.paramValidation = [
    param('id').isInt().withMessage("Id should be interger")
]