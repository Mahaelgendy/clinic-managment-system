const controller = require ("../Controllers/patient");
const express = require("express");

const router= express.Router();

router.route("/patiets")
        .get(controller.getAllPatients)
        .post(controller.addPatient)
        .patch(controller.updatePatient)
        .delete(controller.deletePatients);

router.get("/patients/:id",controller.getPatientByID);
router.delete("/patients/:id",controller.deletePatientById)

module.exports = router;