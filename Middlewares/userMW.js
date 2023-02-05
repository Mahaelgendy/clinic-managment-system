
const {body, param} = require('express-validator')
exports.userValidation = [
    body('fullName').isString().withMessage("Name should be String"),
    body('password').not().isEmpty().isLength({min: 6}).withMessage("Password must be at least 6 char long"),
    body('email').isEmail().withMessage("Email is invalid"),
    body('age').isInt().withMessage("Age is invalid"),
    body('gender').isIn(['Female', 'Male']).withMessage("Gender is invalid"),
    body('address.city').isString().withMessage("Invalid city"),
    body('address.street').isString().withMessage("Invalid street"),
    body('address.building').isInt().withMessage("Invalid building"),
    body('role').isIn(['admin','doctor', 'patient', 'employee']).withMessage("Role is invalid")
]