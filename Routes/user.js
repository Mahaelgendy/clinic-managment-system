
const express = require("express");
const router = express.Router();

const controller = require("./../Controllers/user");

const userValidation = require("./../Middlewares/userMW");
const validator = require("./../Middlewares/errorValidation");
const authenticationMW=require("./../Middlewares/Authorization")

const upload = require("./../Middlewares/uploadImageMW");


router.route("/users")
    .get(authenticationMW.isAdmin,
        controller.getAllUsers)
    .post(
        authenticationMW.isAdmin,
        upload.single("profile"),
        userValidation.userbodyValidation,
        validator,
        controller.addUser)
    .delete(
        authenticationMW.isAdmin,
        controller.deleteUsers)
    .patch(
        authenticationMW.isAdmin,
        upload.single("profile"),
        userValidation.userbodyValidation,
        validator,
        controller.updateUser)

module.exports = router