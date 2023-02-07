const controller = require('../Controllers/service');
const error = require("../Middlewares/errorValidation")
const express = require('express');

const validator = require("../Middlewares/clinicMW")
const authenticationMW=require("./../Middlewares/Authorization")
const router = express.Router();

router.route("/service")
    .get(authenticationMW.anyUser,
        controller.agetAllServices)
    .post(authenticationMW.isDoctorOrAdmin,
        validator.serviceValidation,
        error,
        controller.addservice)
    .delete(controller.deleteByFilter);
    
router.route("/service/:id")
    .get(authenticationMW.anyUser,
        controller.getServiceById)
    .delete(
        authenticationMW.isDoctorOrAdmin,
        controller.deleteserviceById)
    .patch(
        authenticationMW.isDoctorOrAdmin,
        validator.serviceValidation,
        error,
        controller.updateservice)

module.exports = router;









