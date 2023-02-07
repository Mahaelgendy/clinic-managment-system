const controller = require('../Controllers/service');
const express = require('express');

const validator = require("../Middlewares/clinicMW")
const authenticationMW=require("./../Middlewares/Authorization")
const router = express.Router();

router.route("/service")
    .get(authenticationMW.anyUser,
        controller.agetAllServices)
    .post(authenticationMW.isDoctorOrAdmin,
        validator.serviceValidation,
        controller.addservice);
    
router.route("/service/:id")
    .get(authenticationMW.anyUser,
        controller.getServiceById)
    .delete(
        authenticationMW.isDoctorOrAdmin,
        controller.deleteserviceById)
    .patch(
        authenticationMW.isDoctorOrAdmin,
        validator.serviceValidation,
        controller.updateservice)

module.exports = router;









