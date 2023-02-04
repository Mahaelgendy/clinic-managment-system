const controller = require ("../Controllers/employee");
const express = require("express");

const router = express.Router();

router.route("/employees")
       .get(controller.getAllEmployees)
       .post(controller.addEmployee)
       .delete(controller.deleteEmployees)


router.get("/employees/:id",controller.getEmployeeByID);
router.delete("/employees/:id",controller.deleteEmployeeByID);
router.patch("/employees/:id",controller.updateEmployee);

module.exports = router;