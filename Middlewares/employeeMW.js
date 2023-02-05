
const {body, param} = require('express-validator');

exports.employeevalidation = [
    body('employeeSalary').isInt().withMessage("salary should be integer"),
    body('employeePhone').isMobilePhone().withMessage("invalid phone number"),
    body('employeePosition').isString().isIn(['receptionist', 'assistant']).withMessage("Position shoud be string and 'receptionist' or 'assistant' "),
    body('employeeID').isMongoId().withMessage("employee id should be mongo id"),
    body('clinic_Id').isMongoId().withMessage("clinic id should be mongo id"),

]

exports.paramvalidation = [
    param('id').isInt().withMessage("Id should be interger")
];