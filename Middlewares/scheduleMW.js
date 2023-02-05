const {body, param} = require("express-validator");

exports.bodyValidation = [
    body("doctor_id").isInt().withMessage("Doctor ID must be Numeric and required"),
    body("clinic_id").isInt().withMessage("ClinicID must be Numeric and required"),
    body("date").isString().notEmpty().matches(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).withMessage("Date must be string in format yyyy-mm-dd"),
    body("from").isString().notEmpty().matches(/^(?:(?:[0-1][0-9]|2[0-3]):[0-5]?[0-9](?::[0-5]?[0-9])?)|(?:[0-9]:[0-5]?[0-9](?::[0-5]?[0-9])?)$/).withMessage("Start time must be string in format hh:mm:ss"),
    body("to").isString().notEmpty().matches(/^(?:(?:[0-1][0-9]|2[0-3]):[0-5]?[0-9](?::[0-5]?[0-9])?)|(?:[0-9]:[0-5]?[0-9](?::[0-5]?[0-9])?)$/).withMessage("End time must be string in format hh:mm:ss"),
    body('duration').isInt().withMessage("Duration must be number ")
]

exports.paramValidation = [
    param('id').isInt().withMessage("Id should be interger")
]