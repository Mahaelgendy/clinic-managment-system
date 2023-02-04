const controller = require('../Controllers/service');
const express = require('express');

const validator = require("../Middlewares/clinicMW")
const router = express.Router();

router.route("/service")
    .get(controller.getAllServices)
    .post(
        validator.serviceValidation,
        controller.addservice);
    
router.route("/service/:id")
    .get(controller.getServiceById)
    .delete(controller.deleteserviceById)
    .patch(
        validator.serviceValidation,
        controller.updateservice)

module.exports = router;









