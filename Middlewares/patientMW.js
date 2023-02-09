
const {body,param} = require('express-validator');

exports.patientvalidation = [
    body('patientStatus').isString().optional().isIn(['First Time', 'follow Up']).withMessage("status shoud be string and First Time follow Up "),
    body('patientHistory').isString().optional().withMessage("History should be string"),
    body('patientHeight').isInt().optional().withMessage("height shouls be integer"),
    body('patientWeight').isInt().optional().withMessage("weight should be integer"),
    body('patientHasInsurance').optional().isBoolean().withMessage("hasInsurance should be true or false"),
    body('patientPhone').isMobilePhone().optional().matches(/^01[0-2,5]\d{8}$/).withMessage("phone number should start with 010- 012-015-011")
]

exports.paramvalidation = [
    param('id').isInt().withMessage("Id should be interger")
];