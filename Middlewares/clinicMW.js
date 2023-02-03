const {body , param} = require("express-validator")

exports.clinicValidation=[
    body("_id").isInt().notEmpty().withMessage("ID is Numeric and required"),
    body("clinic_location").isObject().notEmpty().withMessage("location for this clinic is required"),
    body("service.name").isString().withMessage("service name in this clinic"),
    body("service.salary").isInt().withMessage("service salary in this clinic"),
    body("service.doctor_id").isInt().withMessage("doctor id for this service in this clinic")
]
















