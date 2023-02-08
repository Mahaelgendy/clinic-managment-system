


const {body , param} = require('express-validator');
exports.bodyValidation = [
    body('name').isString().optional().withMessage("Name should be string"),
    body('company').isString().optional().withMessage("Company shoud be string"),
    body('speciality').isString().optional().withMessage("Speciality shoud be string"),
    body('description').isString().optional().withMessage("Description shoud be string"),
]
exports.specialityParamValidation = [
    param('speciality').isString().withMessage("Speciality is invalid")
];
exports.nameParamValidation = [
    param('name').isString().withMessage("Name is invalid")
]
exports.idParamValidation = [
    param('id').isInt().withMessage("Id should be interger")
]
