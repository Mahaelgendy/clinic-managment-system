const {body , param} = require("express-validator")


exports.prescriptionValidation=[ 
    body("diagnosis").isString().notEmpty().withMessage("diagnosis is required"),
    body("currentExamination").isString().withMessage("appointment date is required"),
    body("nextExamination").isString().withMessage(" next consiled date is required"),
    body("doctor_id").isInt().notEmpty().withMessage("doctor id is requied"),
    body("patient_id").isInt().notEmpty().withMessage("clinic id is requied"),
    body("medicine_id").toArray().notEmpty().withMessage("medicine list is requied")
]
