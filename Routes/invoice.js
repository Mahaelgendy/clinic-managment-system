const express = require('express');
const payment = require("../Middlewares/payment")
const router = express.Router();


const controller = require('./../Controllers/invoice')
const errorValidator = require("./../Middlewares/errorValidation");
const invoiceValidation = require("../Middlewares/invoiceMW")

router.route("/invoice")
    .get(controller.getAllInvoices)
    .post(
     //   payment.createToken,
        invoiceValidation.bodyValidation,
        errorValidator,
        controller.addInvoice
    )
    .delete(controller.deleteInvoiceByFilter);
    
        
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

// router.route("/payment")
//     .post(payment.createToken)

 module.exports= router;