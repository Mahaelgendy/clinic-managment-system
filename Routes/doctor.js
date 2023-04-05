
// const express = require('express');
// const controller = require('./../Controllers/doctor');
// const doctorValidation = require('./../Middlewares/doctorMW');
// const userValidation = require("./../Middlewares/userMW");
// const validator = require("./../Middlewares/errorValidation");
// const authenticationMW=require("./../Middlewares/Authorization")
// const router = express.Router();

// const upload = require("./../Middlewares/uploadImageMW");

// router.route("/doctors/:id")
//     .get(
//         authenticationMW.isDoctorOrAdmin,
//         doctorValidation.paramValidation,
//         validator,
//         controller.getDoctorById)
//     .delete(
//         authenticationMW.isAdmin,
//         doctorValidation.paramValidation,
//         validator,
//         controller.deleteDoctorById)
//     .patch(
//         authenticationMW.isDoctorOrAdmin,
//         upload.single("image"),
//         doctorValidation.paramValidation,
//         doctorValidation.doctorValidataion,
//         userValidation.userbodyValidation,
//         validator,
//         controller.updateDoctorById)


// router.route('/doctors')
//     .get(
//         authenticationMW.isAdmin,
//         controller.getAllDoctors)
    
//     .post(
//         authenticationMW.isAdmin,
//         upload.single("image"),
//         userValidation.userbodyValidation,
//         doctorValidation.doctorValidataion,
//         validator,
//         controller.addDoctor)

// router.route("/doctors/email/:email")
//         .get(
//             authenticationMW.isDoctorOrAdmin,
//             userValidation.userEmailValidation,
//             validator,
//             controller.getDoctorByEmail
//         )
//         .patch(
//             authenticationMW.isDoctorOrAdmin,
//             upload.single("image"),
//             userValidation.userEmailValidation,
//             doctorValidation.doctorValidataion,
//             userValidation.userbodyValidation,
//             validator,
//             controller.updateDoctorByEmail
//         )


// module.exports = router


const express = require('express');
const controller = require('./../Controllers/doctor');
const doctorValidation = require('./../Middlewares/doctorMW');
const userValidation = require("./../Middlewares/userMW");
const validator = require("./../Middlewares/errorValidation");
const authenticationMW=require("./../Middlewares/Authorization")
const router = express.Router();

const upload = require("./../Middlewares/uploadImageMW");

router.route("/doctors/:id")
    .get(
        authenticationMW.isDoctorOrAdmin,
        doctorValidation.paramValidation,
        validator,
        controller.getDoctorById)
    .delete(
        authenticationMW.isAdmin,
        doctorValidation.paramValidation,
        validator,
        controller.deleteDoctorById)
    .patch(
        authenticationMW.isDoctorOrAdmin,
        // upload.single("image"),
        doctorValidation.paramValidation,
        doctorValidation.doctorValidataion,
        userValidation.userbodyValidation,
        validator,
        controller.updateDoctorById)


router.route('/doctors')
    .get(
        authenticationMW.isEmployeeOrAdmin,
        controller.getAllDoctors)
    
    .post(
        authenticationMW.isAdmin,
        // upload.single("image"),
        userValidation.userbodyValidation,
        doctorValidation.doctorValidataion,
        validator,
        controller.addDoctor)

router.route("/doctors/email/:email")
        .get(
            authenticationMW.isDoctorOrAdmin,
            userValidation.userEmailValidation,
            validator,
            controller.getDoctorByEmail
        )
        .patch(
            authenticationMW.isDoctorOrAdmin,
            // upload.single("image"),
            userValidation.userEmailValidation,
            doctorValidation.doctorValidataion,
            userValidation.userbodyValidation,
            validator,
            controller.updateDoctorByEmail
        )
router.route("/doctors/fullName/:fullName")
            .get(
                controller.getDoctorByName
            )
module.exports = router
