
const express = require("express");
const controller = require ("../Controllers/employee");
const employeeValidation = require("./../Middlewares/employeeMW");
const validator = require("./../Middlewares/errorValidation");

const router = express.Router();

router.route("/employees")
       .get(
            employeeValidation.employeevalidation,
            validator,
            controller.getAllEmployees)
       .post(  
            employeeValidation.employeevalidation,
            validator,
            controller.addEmployee)
       .delete( 
            employeeValidation.employeevalidation,
            validator,
            controller.deleteEmployees)



router.route("/employees/:id")
        .get(
            employeeValidation.paramvalidation,
            validator,
            controller.getEmployeeByID)
        .delete( 
            employeeValidation.paramvalidation,
            validator,
            controller.deleteEmployeeByID)
        .patch(  
            employeeValidation.paramvalidation,
            validator,
            controller.updateEmployee)


module.exports = router;