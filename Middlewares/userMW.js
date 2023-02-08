
require('../Models/userModel');
require('../Models/doctorModel');
const mongoose = require("mongoose")
const UserSchema = mongoose.model('users');


const {body, param} = require('express-validator')
exports.userbodyValidation = [
    body('fullName').isString().optional().withMessage("Name should be String"),
    body('password').not().isEmpty().isLength({min: 6}).optional().withMessage("Password must be at least 6 char long"),
    body('email').isEmail().optional().withMessage("Email is invalid"),
    body('age').optional().isInt().optional().withMessage("Age is invalid"),
    body('gender').optional().isIn(['Female', 'Male']).withMessage("Gender is invalid"),
    body('address.city').isString().optional().withMessage("Invalid city"),
    body('address.street').optional().isString().withMessage("Invalid street"),
    body('address.building').optional().isInt().withMessage("Invalid building"),
    body('role').optional().isIn(['admin','doctor', 'patient', 'employee']).withMessage("Role is invalid")
]

exports.useridValidaion = [
    param('id').isMongoId().withMessage("Id is invalid"),
]

exports.userNameValidation = [
    param('name').isString().withMessage("Name should be String")
]
exports.userEmailValidation = [
    param('email').isEmail().withMessage("Email is invalid")
]
