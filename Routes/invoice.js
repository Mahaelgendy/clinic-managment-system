const express = require('express');
const router = express.Router();

const controller = require('./../Controllers/invoice')
const errorValidator = require("./../Middlewares/errorValidation");
const invoiceValidation = require("../Middlewares/invoiceMW")

router.route("/invoice")
    .get(controller.getAllInvoices)
    .post(
        invoiceValidation.bodyValidation,
        errorValidator,
        controller.addInvoice
    )
    
        
router.route("/invoice/:id")
    .get(
        invoiceValidation.paramValidation,
        errorValidator,
        controller.getInvoiceById
    )
    .patch(
        invoiceValidation.paramValidation,
        errorValidator,
        invoiceValidation.bodyValidation,
        errorValidator,
        controller.updateInvoice
    )
    .delete(
        invoiceValidation.paramValidation,
        errorValidator,
        controller.deleteInvoice
    );
 router.route("/displayinvoice/:id")
        .get(controller.displayInvoiceById)
 module.exports= router;