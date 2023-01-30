const express=require("express");
const server=express();

let port=process.env.PORT||8080;
server.listen(port,()=>{
    console.log("I am listening..............", port);
});

//Not Found MW
server.use((request ,response, next)=>{
    response.status(404).json({data:"Not Fount"});
});

//Error MW
server.use((error,request,response,next)=>{
    response.status(500).json({message:"Error "+error});
});