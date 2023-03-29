
const express = require("express");
const controller = require ("../Controllers/employee");
const employeeValidation = require("./../Middlewares/employeeMW");
const validator = require("./../Middlewares/errorValidation");
const authenticationMW=require("./../Middlewares/Authorization")
const userValidation = require("./../Middlewares/userMW");

const upload = require("./../Middlewares/uploadImageMW");
const { useridValidaion } = require("../Middlewares/userMW");

const router = express.Router();

router.route("/employees")
    .get(
        authenticationMW.isAdmin,
        controller.getAllEmployees)
    .post(  
            authenticationMW.isAdmin,
        //     upload.single("image"),
            employeeValidation.employeevalidation,
            validator,
            controller.addEmployee)
    .delete( 
            authenticationMW.isAdmin,
            employeeValidation.employeevalidation,
            validator,
            controller.deleteEmployees)



router.route("/employees/:id")
    .get(
            authenticationMW.isEmployeeOrAdmin,
            employeeValidation.paramvalidation,
            validator,
            controller.getEmployeeByID)
    .delete( 
            authenticationMW.isAdmin,
            employeeValidation.paramvalidation,
            validator,
            controller.deleteEmployeeByID)
    .patch(  
            authenticationMW.isEmployeeOrAdmin,
        //     upload.single("image"),
            employeeValidation.paramvalidation,
            validator,
            controller.updateEmployee)

router.route("/employees/email/:email")
        .get(
                authenticationMW.isEmployeeOrAdmin,
                userValidation.userEmailValidation,
                validator,
                controller.getEmployeeByEmail)

router.route("/employees/fullName/:fullName")
        .get(
                controller.getEmployeeByName
        )              

module.exports = router;