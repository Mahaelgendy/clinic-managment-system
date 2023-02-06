
const {body,param} = require('express-validator');

exports.patientvalidation = [
    body('patientStatus').isString().isIn(['First Time', 'follow Up']).withMessage("status shoud be string and First Time follow Up "),
    body('patientHistory').isString().withMessage("History should be string"),
    body('patientHeight').isInt().withMessage("height shouls be integer"),
    body('patientWeight').isInt().withMessage("weight should be integer"),
    body('patientHasInsurance').isBoolean().withMessage("hasInsurance should be true or false"),
    body('patientPhone').isMobilePhone().matches(/^01[0-2,5]\d{8}$/).withMessage("phone number should start with 010- 012-015-011"),
    // body('patientID').isMongoId().withMessage("patientID should be mongo id")
]

exports.paramvalidation = [
    param('id').isInt().withMessage("Id should be interger")
];