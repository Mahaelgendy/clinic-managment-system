
const express = require("express");
const router = express.Router();

const controller = require("./../Controllers/user");

const userValidation = require("./../Middlewares/userMW");
const validator = require("./../Middlewares/errorValidation");

const upload = require("./../Middlewares/uploadImageMW");


router.route("/users")
    .get(controller.getAllUsers)
    .delete(controller.deleteUsers)
    .patch(
        upload.single("profile"),
        userValidation.userbodyValidation,
        validator,
        controller.updateUser)


router.route("/changePassword")
        .post(controller.changePassword)
module.exports = router