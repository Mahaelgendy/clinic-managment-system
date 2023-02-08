const { response,request } = require("express");

const stripe = require("stripe")("sk_test_51MYW00L4FZm4LCWYTDkVw2JR6AYkNpcMdotgqSLDCdbiSeaCIz51U1QrcOT3dKepTfgjIZbSzdT3gwIjFa0mdG2W00X1uRIqgn");

module.exports.payment=async (request , response,next )=>{
   // console.log(request.query);
   await stripe.tokens.create({
        card: {
        number: '4242424242424242',
        exp_month: 	03,
        exp_year: 2030,
        cvc: '737'
        }
    }, async function(err, token) {
        if (err) {
            // handle the error
            console.log(err);
           // return err
        } else {
            // send the token in the request body
            //console.log(token);
            let y = token.id
           // console.log(token.id);
              await stripe.charges.create({
                    amount: 2000,
                    currency: "usd",
                    description: "An example charge",
                    source: token.id
             },async function (error, charge) {
                if (error) {
                    //console.log("outttt")
                    // console.log(error)
                    // return error
                    next(new Error({message:"transaction is not completed"}));
                }
                if (charge) {
                    // console.log("inn")
                      console.log("charge id::"+charge.id)
                    //var transaction_id = charge.id
                    //request.body.trans = charge.id;
                   // request.trans = charge.id;

                   // response.status(201).json(request.trans)

                  // console.log("request.trans::" + request.trans)
                    return charge.id
                    //next()
                }

            })
        }
    });
}



/*
 module.exports.payment=function createToken(){ 
            stripe.tokens.create({
                card: {
                number: '4242424242424242',
                exp_month: 	03,
                exp_year: 2030,
                cvc: '737'
                }
            }, async function(err, token) {
                if (err) {
                    // handle the error
                    console.log(err);
                   // return err
                } else {
                    // send the token in the request body
                    //console.log(token);
                    let y = token.id
                    console.log(token.id);
                     await stripe.charges.create({
                            amount: 2000,
                            currency: "usd",
                            description: "An example charge",
                            source: token.id
                     }, function (error, charge) {
                                    if (error) {
                                        console.log("outttt")
                                       // console.log(error)
                                        return error
                                    }
                                    if (charge) {
                                        console.log("inn")
                                      //  console.log(charge)
                                        var transaction_id = charge.id
                                          console.log(transaction_id)
                                        return transaction_id
                                    }
                                    else {
                                        console.log("wrong")
                                        return err
                                    }
                                }
                        )
                    
                }
            });
}*/

// var x=createToken();
// console.log(x);



// var chargeCustomer=async function(){
//     try {
//       let {res} = await stripe.charges.create({
//         amount: 2000,
//         currency: "usd",
//         description: "An example charge",
//         source: "tok_1MYvu7L4FZm4LCWYs0LV52CI"
//       }, function (charge, error) {
//           if (error) {
//               console.log(error)
//           }
//           if (charge) {
//             console.log("write")
//               console.log(charge)
//           }
//           else {
//               console.log("wrong")
//           }
//       }
//       );
//         console.log("in")
//         console.log(res)
//         console.log(JSON.stringify(res))

//       //res.json({res});
//     } catch (err) {
//         console.log("out")
//         console.log(err)
//       //res.status(500).end();
//     }
// };
  
// chargeCustomer();