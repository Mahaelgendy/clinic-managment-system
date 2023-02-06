const mongoose = require ("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("./../Models/userModel");

const userSchema = mongoose.model("users")

exports.login=(async(request,response,next)=>{

    const user =await userSchema.findOne({email:request.body.email})
    if(user != null)
    {
        try
        {
            if(await bcrypt.compare(request.body.password, user.password))
            {
                let token = jwt.sign({
                    id:user._id,
                    role:user.role
                },
                process.env.SECRET_KEY,
                {expiresIn:"2h"})

                if(true && user.role=="admin")
                {
                    response.status(200).json({message:"Admin",token});

                }
                else if (true && user.role =="doctor")
                {
                    response.status(200).json({message:"doctor",token});

                }
                else if(true && user.role =="patient")
                {
                    response.status(200).json({message:"patient",token});

                }
                else if(true && user.role =="employee")
                {
                    response.status(200).json({message:"employee",token});

                }

            }
            else
            {
                response.status(400).json({message:"Incorrect password"});

            }
           
        }
        catch(error)
        {
            console.log("hello")
            next(error)
        }
    }
    else
    {
        response.status(400).json({message:"can not find user"});
    }
})