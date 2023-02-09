
const stripe = require('stripe')('sk_test_51MYW00L4FZm4LCWYTDkVw2JR6AYkNpcMdotgqSLDCdbiSeaCIz51U1QrcOT3dKepTfgjIZbSzdT3gwIjFa0mdG2W00X1uRIqgn');

const { response,request } = require("express");

module.exports.payment=async (request , response,next )=>{
   await stripe.token.create({
        card: {
        number: '4242424242424242',
        exp_month: 	03,
        exp_year: 2030,
        cvc: '737'
    }
    })//.then( (res , response)=>{

    //     let param ={
    //         amount: 2000,
    //         currency: "usd",
    //         description: "An example charge",
    //         source: token.id
    //     }
    //      stripe.charges.create(param, function (error, charge) {
    //     if (error) {
    //         console.log("outttt")
    //         console.log(error)
    //         next(new Error({message:"transaction is not completed"}));
    //     }
    //     if (charge) {
    //         console.log("charge id::"+charge.id)
    //         var transaction_id = charge.id
    //          return charge.id
    //    }})
    // })
    // .then(data =>
    //     console.log(data)
    // )
    .catch(err =>
        console.log(err))
    
    // async function(err, token) {
    //     if (err) {
    //         // handle the error
    //         console.log(err);
    //        // return err
    //     } else {
    //         // send the token in the request body
    //         //console.log(token);
    //         let y = token.id
    //        // console.log(token.id);

    //     }
    //}
}




// exports.createToken=(request , response )=>{
//    // console.log(request.query);
//     stripe.tokens.create({
//         card: {
//         number: '4242424242424242',
//         exp_month: 	03,
//         exp_year: 2030,
//         cvc: '737'
//         }
//     }, async function(err, token) {
//         if (err) {
//             // handle the error
//             console.log(err);
//            // return err
//         } else {
//              await stripe.charges.create({
//                     amount: 2000,
//                     currency: "usd",
//                     description: "An example charge",
//                     source: token.id
//              }, function (error, charge) {
//                 if (error) {
//                     next(new Error({message:"trensaction is not completed"}));
//                 }
//                 if (charge) {
//                     response.body.x = charge.id;
//                     response.status(201).json(response.body.x)
//                 }

//             })
//         }
//     }).then(res=>
//         console.log("token is "+'charge.id'));
// }

