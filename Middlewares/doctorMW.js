
const {body , param} = require('express-validator');

exports.doctorValidator = [
    body('fullName').isString().withMessage("Name should be String"),
     body('password').not().isEmpty().isLength({min: 6}).withMessage("Password must be at least 6 char long"),
    body('email').isEmail().withMessage("Email is invalid"),
    body('age').isInt().withMessage("Age is invalid"),
    body('gender').isIn(['Female', 'Male']).withMessage("Gender is invalid"),
    body('address.city').isString().withMessage("Invalid city"),
    body('address.street').isString().withMessage("Invalid street"),
    body('address.building').isInt().withMessage("Invalid building"),
    body('role').isIn(['admin','doctor', 'patient', 'employee']).withMessage("Role is invalid"),
    body('specialization').isAlpha().withMessage("Specialization is invalid"),
    body('price').isInt().withMessage("Price is invalid"),
    // body("clinic_id").isInt().withMessage("Clinic_id is invalid"),
    // body("startTime").isString().matches("/^\d{2}:\d{2}:\d{2}$/").withMessage("Start Time is invalid"),
    // body("endTime").isString().matches("/^\d{2}:\d{2}:\d{2}$/").withMessage("End Time is invalid"),
    body('duration').isInt().withMessage("Duration is invalid")
]
exports.paramValidation = [
    param('id').isInt().withMessage("Id should be interger")
];