const controller = require ("../Controllers/patient");
const express = require("express");

const router= express.Router();

router.route("/patiets")
        .get(controller.getAllPatients)
        .post(controller.addPatient)
        .delete(controller.deletePatients);

router.get("/patients/:id",controller.getPatientByID);
router.delete("/patients/:id",controller.deletePatientById)
router.patch("/patients/:id",controller.updatePatient)

module.exports = router;