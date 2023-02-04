const express=require("express");
const mongoose = require('mongoose');
const  morgan = require('morgan');
const server=express();
const appointmentRoutes = require("./Routes/appointment");
const clinicRoutes = require("./Routes/clinic");
const serviceRoutes = require("./Routes/service");
const invoiceRoutes = require("./Routes/invoice");

const patientRoutes = require ("./Routes/patient");
const doctorRoutes = require("./Routes/doctor");
let port=process.env.PORT||8080;

mongoose.set('strictQuery', true);

mongoose.connect("mongodb://127.0.0.1:27017/clinicSystemDB")
    .then(()=>{
        server.listen(port,()=>{
            console.log("I am listening..............", port);
        });
        console.log("db connected");
    })
    .catch(error =>{
        console.log("DB error",error);
    });

server.use(morgan('combined'));

//body parser
server.use(express.json());

//routes
server.use(appointmentRoutes);
server.use(clinicRoutes);
server.use(serviceRoutes)
server.use(invoiceRoutes);
server.use(patientRoutes);
server.use(doctorRoutes);
//Not Found MW
server.use((request ,response, next)=>{
    response.status(404).json({data:"Not Fount"});
});

//Error MW
server.use((error,request,response,next)=>{
    response.status(500).json({message:"Error "+error});
});