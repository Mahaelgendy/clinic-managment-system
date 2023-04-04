const express = require("express");
const controller = require("./../Controllers/authenticationController");
const validator = require("./../Middlewares/errorValidation");
const registerValidation = require("./../Middlewares/userMW");
const router = express.Router();
const upload = require("./../Middlewares/uploadImageMW")

router.route("/login")
       .post(controller.login);


router.route("/signUp")   
        .post(
       //     upload.single("image"),
            registerValidation.userbodyValidation,
            validator,
            controller.signUp)

module.exports = router;