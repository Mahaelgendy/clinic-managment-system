
const express = require('express');
const controller = require('./../Controllers/medicine');
const medicineValidation = require("./../Middlewares/medicineMW")
const validator = require("./../Middlewares/errorValidation");
const router = express.Router();
const authenticationMW=require("./../Middlewares/Authorization")

router.route('/medicines')
    .get(
        authenticationMW.isDoctorOrAdmin,
        controller.getAllMedicinces)
    .post(
        authenticationMW.isDoctor,
        medicineValidation.bodyValidation,
        validator,
        controller.addMedicine)
    .patch(
        authenticationMW.isDoctor,
        medicineValidation.bodyValidation,
        validator,
        controller.updateMedicines)
        
    .delete(
        authenticationMW.isDoctorOrAdmin,
        controller.deleteMedicine)


// router.route('/medicines/:id')
//     .get(
//         medicineValidation.idParamValidation,
//         validator,
//         controller.getMedicineById)
//     .patch(
//         medicineValidation.idParamValidation,
//         medicineValidation.bodyValidation,
//         validator,
//         controller.updateMedicineById)
//     .delete(
//         medicineValidation.idParamValidation,
//         validator,
//         controller.deleteMediciteById)

// router.route('/medicines/speciality/:speciality')
//     .get(
//         medicineValidation.specialityParamValidation,
//         validator,
//         controller.getAllMedicine)

// router.route('/medicines/speciality/:speciality/name/:name')
//     .get(
//         medicineValidation.specialityParamValidation,
//         medicineValidation.nameParamValidation,
//         validator,
//         controller.getMedicine)
//     .patch(
//         medicineValidation.specialityParamValidation,
//         medicineValidation.nameParamValidation,
//         medicineValidation.bodyValidation,
//         validator,
//         controller.updateMedicine)

module.exports = router