
const express = require("express");
const controller = require ("../Controllers/employee");
const employeeValidation = require("./../Middlewares/employeeMW");
const validator = require("./../Middlewares/errorValidation");
const authenticationMW=require("./../Middlewares/Authorization")

const router = express.Router();

router.route("/employees")
    .get(
        authenticationMW.isAdmin,
        controller.getAllEmployees)
    .post(  
            authenticationMW.isAdmin,
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
            authenticationMW.isEmployeeOrAdmin,
            employeeValidation.paramvalidation,
            validator,
            controller.deleteEmployeeByID)
    .patch(  
            authenticationMW.isEmployeeOrAdmin,
            employeeValidation.paramvalidation,
            validator,
            controller.updateEmployee)


module.exports = router;