
const express = require('express');
const controller = require('./../Controllers/medicine');
const medicineValidation = require("./../Middlewares/medicineMW")
const validator = require("./../Middlewares/errorValidation");
const router = express.Router();

router.route('/medicines')
    .post(
        medicineValidation.bodyValidation,
        validator,
        controller.addMedicine)


router.route('/medicines/:id')
    .get(
        medicineValidation.idParamValidation,
        validator,
        controller.getMedicineById)
    .patch(
        medicineValidation.idParamValidation,
        medicineValidation.bodyValidation,
        validator,
        controller.updateMedicineById)
    .delete(
        medicineValidation.idParamValidation,
        validator,
        controller.deleteMediciteById)

router.route('/medicines/speciality/:speciality')
    .get(
        medicineValidation.specialityParamValidation,
        validator,
        controller.getAllMedicine)

router.route('/medicines/speciality/:speciality/name/:name')
    .get(
        medicineValidation.specialityParamValidation,
        medicineValidation.nameParamValidation,
        validator,
        controller.getMedicine)
    .patch(
        medicineValidation.specialityParamValidation,
        medicineValidation.nameParamValidation,
        medicineValidation.bodyValidation,
        validator,
        controller.updateMedicine)

module.exports = router