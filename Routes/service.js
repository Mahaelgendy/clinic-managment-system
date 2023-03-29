const controller = require('../Controllers/service');
const error = require("../Middlewares/errorValidation")
const express = require('express');

const validator = require("../Middlewares/clinicMW")
const authenticationMW=require("./../Middlewares/Authorization")
const router = express.Router();

router.route("/service")
    .get(
        // authenticationMW.anyUser,
        controller.agetAllServices)
    .post(
        // authenticationMW.isAdmin,
        validator.serviceValidation,
        error,
        controller.addservice)
    .delete(
        // authenticationMW.isAdmin,
        controller.deleteByFilter);
    
router.route("/service/:id")
    .get(
        // authenticationMW.anyUser,
        controller.getServiceById)
    .delete(
        // authenticationMW.isAdmin,
        controller.deleteserviceById)
    .patch(
        // authenticationMW.isAdmin,
        validator.serviceValidation,
        error,
        controller.updateservice)

module.exports = router;









