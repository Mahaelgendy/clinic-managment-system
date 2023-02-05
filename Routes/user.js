
const express = require("express");
const router = express.Router();

const controller = require("./../Controllers/user");

const userValidation = require("./../Middlewares/userMW");
const validator = require("./../Middlewares/errorValidation");

router.route("/users")
    .get(controller.getAllUsers)
    .post(
        userValidation.userbodyValidation,
        validator,
        controller.addUser)

router.route("/users/role/:role")
    .get(controller.getAllUsersByRole)

router.route("/users/:id")
    .get(
        userValidation.useridValidaion,
        validator,
        controller.getUserById)
    .delete(
        userValidation.useridValidaion,
        validator,
        controller.deleteUserById)
    .patch(
        userValidation.useridValidaion,
        userValidation.userbodyValidation,
        validator,
        controller.updateUserById)

router.route("/users/email/:email")
    .get(
        userValidation.userEmailValidation,
        validator,
        controller.getUserByEmail)
    .delete(
        userValidation.userEmailValidation,
        validator,
        controller.deleteUserByEmail)
    .patch(
        userValidation.userEmailValidation,
        userValidation.userbodyValidation,
        validator,
        controller.updateUserByEmail)

router.route("/users/name/:name")
    .get(
        userValidation.userNameValidation,
        validator,
        controller.getUserByName)

module.exports = router