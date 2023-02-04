


const {body , param} = require('express-validator');
exports.bodyValidation = [
    body('name').isString().withMessage("Name should be string"),
    body('company').isString().withMessage("Company shoud be string"),
    body('speciality').isString().withMessage("Speciality shoud be string"),
    body('description').isString().withMessage("Description shoud be string"),
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
