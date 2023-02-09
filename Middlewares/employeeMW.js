
const {body, param} = require('express-validator');

exports.employeevalidation = [
    body('employeeSalary').optional().isInt().withMessage("salary should be integer"),
    body('employeePhone').optional().isMobilePhone().matches(/^01[0-2,5]\d{8}$/).withMessage("phone number should start with 010- 012-015-011"),
    body('employeePosition').optional().isString().isIn(['receptionist', 'assistant']).withMessage("Position shoud be string and 'receptionist' or 'assistant' "),
    body('clinic_Id').isInt().optional().withMessage("clinic id should be integer")
]

exports.paramvalidation = [
    param('id').isInt().withMessage("Id should be interger")
];