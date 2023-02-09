const express = require('express');
const payment = require("../Middlewares/payment")
const router = express.Router();


const controller = require('./../Controllers/invoice')
const errorValidator = require("./../Middlewares/errorValidation");
const invoiceValidation = require("../Middlewares/invoiceMW")
const authenticationMW=require("./../Middlewares/Authorization")

router.route("/invoice")
    //.all(authenticationMW.isAdmin)
    .get(
        authenticationMW.isEmployeeOrAdmin,
        controller.getAllInvoices)
    .post(
     //   payment.createToken,
        authenticationMW.isEmployee,
        invoiceValidation.bodyValidation,
        errorValidator,
        controller.addInvoice
    )
    .delete(controller.deleteInvoiceByFilter);
    
        
router.route("/invoice/:id")
    .get(
        authenticationMW.isEmployeeOrAdmin,
        invoiceValidation.paramValidation,
        errorValidator,
        controller.getInvoiceById
    )
    .patch(
        authenticationMW.isEmployee,
        invoiceValidation.paramValidation,
        errorValidator,
        invoiceValidation.bodyValidation,
        errorValidator,
        controller.updateInvoice
    )
    .delete(
        authenticationMW.isEmployeeOrAdmin,
        invoiceValidation.paramValidation,
        errorValidator,
        controller.deleteInvoice
    );

// router.route("/payment")
//     .post(payment.createToken)

 router.route("/displayinvoice/:id")
        .get(controller.displayInvoiceById)
 module.exports= router;