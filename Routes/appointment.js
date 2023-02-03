const express = require('express');
const controller = require('./../Controllers/appointment')
const router = express.Router();

router.route("/appointments")
        .get(controller.getAllAppointments)
        .post( controller.addAppointment)
        .patch( controller.updateAppointment)
        .delete(controller.deleteAppointment);
        
 module.exports= router;