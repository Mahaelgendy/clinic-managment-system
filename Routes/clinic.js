const controller = require('../Controllers/clinic');
const express = require('express');

const router = express.Router();

router.route("/clinic")
    .get(controller.getAllClinics)
    .post(controller.addClinic);
    
router.route("/clinic/:id")
    .get(controller.getClinicById)
    .delete(controller.deleteClinicById)
    .patch(controller.updateClinic)


module.exports = router;









