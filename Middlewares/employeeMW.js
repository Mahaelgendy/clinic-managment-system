
const {body, param} = require('express-validator');

exports.employeevalidation = [
    body('employeeSalary').isInt().withMessage("salary should be integer"),
    body('employeePhone').isMobilePhone().matches(/^01[0-2,5]\d{8}$/).withMessage("phone number should start with 010- 012-015-011"),
    body('employeePosition').isString().isIn(['receptionist', 'assistant']).withMessage("Position shoud be string and 'receptionist' or 'assistant' "),
    // body('employeeID').isMongoId().withMessage("employee id should be mongo id"),
    body('clinic_Id').isInt().withMessage("clinic id should be integer"),

]

exports.paramvalidation = [
    param('id').isInt().withMessage("Id should be interger")
];