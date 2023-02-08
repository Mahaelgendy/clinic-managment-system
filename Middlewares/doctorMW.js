
const {body , param} = require('express-validator');

exports.doctorValidataion = [
    body('specialization').isAlpha().optional().withMessage("Specialization is invalid"),
    body('price').isInt().optional().withMessage("Price is invalid"),
]
exports.paramValidation = [
    param('id').isInt().withMessage("Id should be interger")
];