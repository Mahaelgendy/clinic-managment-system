
const express = require("express");
const router = express.Router();

const controller = require("./../Controllers/user");

const userValidation = require("./../Middlewares/userMW");
const validator = require("./../Middlewares/errorValidation");
const authenticationMW=require("./../Middlewares/Authorization")

const upload = require("./../Middlewares/uploadImageMW");

// const multer = require('multer');
// const upload = multer({
//     dest:"uploads/images"
// })


router.route("/users")
    .get(authenticationMW.isAdmin,
        controller.getAllUsers)
    .post(
        // userValidation.userbodyValidation,
        // validator,
        authenticationMW.isAdmin,
        upload.single("profile"),
        controller.addUser)
    .delete(
        authenticationMW.isAdmin,
        controller.deleteUsers)
    .patch(
        authenticationMW.isAdmin,
        userValidation.userbodyValidation,
        validator,
        controller.updateUser)


// router.route("/users/:id")
//     .patch(
//         userValidation.useridValidaion,
//         userValidation.userbodyValidation,
//         validator,
//         controller.updateUserById)

// router.route("/users/email/:email")
//     .patch(
//         userValidation.userEmailValidation,
//         userValidation.userbodyValidation,
//         validator,
//         controller.updateUserByEmail)


module.exports = router