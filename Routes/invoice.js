const express = require('express');
const controller = require('./../Controllers/invoice')
const router = express.Router();

router.route("/invoice")
        .get(controller.getAllInvoices)
        .post( controller.addInvoice)
        .patch( controller.updateInvoice)
        .delete(controller.deleteInvoice);
        
router.route("/invoice/:id",
    // param("id").isInt().withMessage("id should be integr"),
    // validator,
    controller.getInvoiceById
)
        
 module.exports= router;