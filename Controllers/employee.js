
const {request,response} = require("express");
const mongoose = require("mongoose");

require("../Models/userModel");
require("../Models/employeeModel");
require("../Models/clinicModel");

const userSchema = mongoose.model("users");
const employeeSchema = mongoose.model("employees");
const clinicSchema = mongoose.model("clinics");

module.exports.getAllEmployees =  (request,response,next)=>{
     employeeSchema.find({}).populate({path:"employeeData",select:{fullName:1,age:1,gender:1}})
                            .populate({path:"clinicId"})
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
                        position:request.body.employeePosition,
                        employeeData:request.body.employeeID,
                        clinicId:request.body.clinic_Id
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
};


module.exports.deleteEmployeeByID =  (request, response, next)=>{

    try{

        const employeeToBeRemoved = request.params.id;

        employeeSchema.findById({_id:employeeToBeRemoved})
        .then((data)=>{
            console.log(employeeToBeRemoved)
            console.log(data.employeeData)
            userSchema.findByIdAndDelete({_id:data.employeeData})
                        .then((data)=>{
                            console.log(data)
                            employeeSchema.findByIdAndDelete({_id:employeeToBeRemoved})
                            .then((data)=>{
                                console.log(data)
                                response.status(200).json({message: "Employee deleted successfully"});

                            })
                        })
                        .catch((error)=>next(error));
            
        })
        .catch((error)=>next(error));
    }catch(error){
        next(error)
    }

};


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
                position:request.body.employeePosition,
                employeeData:request.body.employeeID,
                clinicId:request.body.clinic_Id
            }
        }).then(result=>{
            response.status(200).json({message:"updated"});
        })
        .catch(error=>next(error))
}; 