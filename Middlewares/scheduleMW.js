
const {body, param} = require("express-validator");

exports.scheduleValidation = [
    // body("clinic_id").isInt().withMessage("Clinic_id is invalid"),
    body("startTime").isString().notEmpty().matches(/^(?:(?:[0-1][0-9]|2[0-3]):[0-5]?[0-9](?::[0-5]?[0-9])?)|(?:[0-9]:[0-5]?[0-9](?::[0-5]?[0-9])?)$/).withMessage("Start time must be string in format hh:mm:ss"),
    body("endTime").isString().notEmpty().matches(/^(?:(?:[0-1][0-9]|2[0-3]):[0-5]?[0-9](?::[0-5]?[0-9])?)|(?:[0-9]:[0-5]?[0-9](?::[0-5]?[0-9])?)$/).withMessage("End time must be string in format hh:mm:ss"),
    body('duration').isInt().withMessage("Duration is invalid")
]