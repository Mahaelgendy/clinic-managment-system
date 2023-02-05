
const {body,param} = require('express-validator');

exports.patientvalidation = [
    body('patientStatus').isString().isIn(['Female', 'Male']).withMessage("status shoud be string and 'Female' or 'Male' "),
    body('patientHistory').isString().withMessage("History should be string"),
    body('patientHeight').isInt().withMessage("height shouls be integer"),
    body('patientWeight').isInt().withMessage("weight should be integer"),
    body('patientHasInsurance').isBoolean().withMessage("hasInsurance should be true or false"),
    body('patientPhone').isMobilePhone().withMessage("invalid phone number"),
    body('patientID').isMongoId().withMessage("patientID should be mongo id")
]

exports.paramvalidation = [
    param('id').isInt().withMessage("Id should be interger")
];