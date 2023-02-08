
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
<<<<<<< HEAD
    .post(
        authenticationMW.isAdmin,
        upload.single("profile"),
        userValidation.userbodyValidation,
        validator,
        controller.addUser)
=======
>>>>>>> 48c8e7ed277b8e664c542b275606b73e0c3d96e4
    .delete(
        authenticationMW.isAdmin,
        controller.deleteUsers)
    .patch(
        authenticationMW.isAdmin,
        upload.single("profile"),
        userValidation.userbodyValidation,
        validator,
        controller.updateUser)


router.route("/changePassword")
        .post(controller.changePassword)
module.exports = router