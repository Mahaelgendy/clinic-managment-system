const {body , param} = require("express-validator")

exports.clinicValidation=[
    body("_id").isInt().notEmpty().withMessage("ID is Numeric and required"),
    body("clinic_location").isObject().notEmpty().withMessage("location for this clinic is required"),
    body("clinicName").isString().withMessage("clinic name should be characters only "),

]

exports.serviceValidation=[ 
    body("name").isString().withMessage("service name in this clinic"),
    body("salary").isInt().default(0).withMessage("service salary in this clinic"),
    body("doctor_id").isInt().withMessage("doctor id for this service in this clinic"),
    body("clinic_id").isInt().withMessage("clinic id for this service in this service")
]














