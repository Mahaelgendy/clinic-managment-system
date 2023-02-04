
const {request,response} = require("express");
const mongoose = require("mongoose");

require("../Models/userModel");
require("../Models/employeeModel");
require("../Models/clinicModel");

const userSchema = mongoose.model("users");
const employeeSchema = mongoose.model("employees");
const clinicSchema = mongoose.model("clinics");

module.exports.getAllEmployees =  (request,response,next)=>{
     employeeSchema.find({}).populate({path:"employeeData",select:{fullName:1}})
                          .then((data)=>{
                            response.status(200).json(data);
                          }) 
                          .catch((error)=>next(error));
};

module.exports.addEmployee = (request, response, next)=>{
    userSchema.findOne({email:request.body.email})
              .then((data)=>{
                if(data!=null)
                {
                    let newEmployee=new employeeSchema({
                        salary:request.body.employeeSalary,
                        phone:request.body.employeePhone,
                        position:request.body.employeePosition
                    });
                    newEmployee.save()
                    .then(result=>{
                        response.status(201).json({message:"added new Employee is done"});
                    })
                    .catch(error=>next(error))
                }
                else
                {
                    response.status(404).json({message:"This Email does not exsist"})
                }
              })
              .catch(error=>next(error))
};


module.exports.deleteEmployees = (request, response, next)=>{
    employeeSchema.deleteMany({})
        .then((data)=>{
            response.status(200).json({message:"delete all employees"})
        })
        .catch((error)=>next(error));
}

// module.exports.deleteEmployeeByID = (request, response, next)=>{
//         try{
//             const employeeToBeRemoved = request.params.id;

//             employeeSchema.findOne({_id:employeeToBeRemoved})
//                             .then((data)=>{
//                                 userSchema.findByIdAndDelete({_id:data.employeeData})
//                                 .then(()=>{
//                                     employeeSchema.findByIdAndDelete({_id:employeeToBeRemoved})
//                                     .then(()=>{
//                                         response.status(200).json({message:`Employee with Id ${employeeToBeRemoved} deleted`});
//                                     })
//                                 })
//                             })
//                             .catch((error)=>next(error));
//         } 
//         catch (error){
//             next(error)
//         }   
// };
module.exports.deleteEmployeeByID = (request, response, next)=>{
    employeeSchema.findByIdAndDelete({_id:request.params.id})
    .then(()=>{
        response.status(200).json({message:"deleted"+request.params.id});
    })
    .catch((error)=>next(error));
}




module.exports.getEmployeeByID = (request, response, next)=>{
    employeeSchema.findOne({_id:request.params.id}).populate({path:"employeeData",select:{fullName:1}})
                  .then((data)=>{
                        if(data!=null)
                        {
                            response.status(200).json(data);
                        }
                        else
                        {
                            response.json({message:"Employee not Found"});
                        }
                  })
                  .catch(error=>next(error));
};

module.exports.updateEmployee = (request, response, next)=>{
        employeeSchema.findByIdAndUpdate({
            _id:request.params.id
        },
        {
            $set:{
                salary:request.body.employeeSalary,
                phone:request.body.employeePhone,
                position:request.body.employeePosition
            }
        }).then(result=>{
            response.status(200).json({message:"updated"});
        })
        .catch(error=>next(error))
}; 