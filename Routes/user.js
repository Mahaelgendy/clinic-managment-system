
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
    .delete(
        authenticationMW.isAdmin,
        controller.deleteUsers)
    .patch(
        authenticationMW.isAdmin,
        upload.single("image"),
        userValidation.userbodyValidation,
        validator,
        controller.updateUser)


router.route("/changePassword")
        .post(controller.changePassword)
module.exports = router