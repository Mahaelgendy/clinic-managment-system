
const {body,param} = require('express-validator');

exports.patientvalidation = [
    body('status').isString().optional().isIn(['First Time', 'follow Up']).withMessage("status shoud be string and First Time follow Up "),
    body('history').isString().optional().withMessage("History should be string"),
    body('height').isInt().optional().withMessage("height shouls be integer"),
    body('weight').isInt().optional().withMessage("weight should be integer"),
    body('hasInsurance').optional().isBoolean().withMessage("hasInsurance should be true or false"),
    body('phone').isMobilePhone().optional().matches(/^01[0-2,5]\d{8}$/).withMessage("phone number should start with 010- 012-015-011")
]

exports.paramvalidation = [
    param('id').isInt().withMessage("Id should be interger")
];