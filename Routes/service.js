const controller = require('../Controllers/service');
const error = require("../Middlewares/errorValidation")
const express = require('express');

const validator = require("../Middlewares/clinicMW")
const router = express.Router();

router.route("/service")
    .get(controller.agetAllServices)
    .post(
        validator.serviceValidation,
        error,
        controller.addservice)
    .delete(controller.deleteByFilter);
    
router.route("/service/:id")
    .get(controller.getServiceById)
    .delete(controller.deleteserviceById)
    .patch(
        validator.serviceValidation,
        error,
        controller.updateservice)

module.exports = router;









