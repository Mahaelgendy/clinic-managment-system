const express = require("express");
const router = express.Router();

const controller = require("./../Controllers/user");

router.route("/users")
    .get(controller.getAllUsers)
    .post(controller.addUser)

router.route("/users/role/:role")
    .get(controller.getAllUsersByRole)
    
router.route("/users/:id")
    .get(controller.getUserById)
    .delete(controller.deleteUserById)
    .patch(controller.updateUserById)

router.route("/users/email/:email")
    .get(controller.getUserByEmail)
    .delete(controller.deleteUserByEmail)
    .patch(controller.updateUserByEmail)

router.route("/users/name/:name")
    .get(controller.getUserByName)

module.exports = router