
const {body , param} = require('express-validator');

exports.doctorValidataion = [
    body('specialization').isAlpha().withMessage("Specialization is invalid"),
    body('price').isInt().withMessage("Price is invalid"),
]
exports.paramValidation = [
    param('id').isInt().withMessage("Id should be interger")
];