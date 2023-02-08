
const {request,response} = require("express");
const mongoose = require("mongoose");

require("../Models/userModel");
require("../Models/employeeModel");
require("../Models/clinicModel");

const userSchema = mongoose.model("users");
const employeeSchema = mongoose.model("employees");
const clinicSchema = mongoose.model("clinics");

const sortEmployees = (data,query)=>{
    let sortBy = query.sortBy||'salary';
    let order = query.order ||"asc";
    let orderValue = order ==="asc"? 1:-1

    
    return data.sort((a,b)=>{
        if(a[sortBy]<b[sortBy]) return -1*orderValue;
        if(a[sortBy]>b[sortBy]) return 1*orderValue;
    });
};

module.exports.getAllEmployees = async (request,response,next)=>{
    
    const query = {}; 
    if(request.query.id) query._id = Number(request.query.id);
    if(request.query.clinicId) query.clinicId = Number(request.query.clinicId);
    if(request.query.salary) query.salary = Number(request.query.salary);
    if(request.query.position) query.position = request.query.position

    const page = request.query.page *1 || 1;
    const limit = request.query.limit *1 || 3;
    const skip =(page - 1) * limit;

   employeeSchema.find({}).populate({path:"employeeData",select:{fullName:1,age:1,gender:1,email:1}})
                            .populate({path:"clinicId"}).skip(skip).limit(limit)
                            .then((data)=>{
                           let employeeAfterSort= sortEmployees(data, request.query)
                                response.status(200).json(employeeAfterSort);
                            }) 
                            .catch((error)=>next(error));
};


module.exports.addEmployee = (request, response, next)=>{
    userSchema.findOne({email:request.body.email})
              .then((data)=>{
                if(data!=null&& data.role ==="employee")
                { 
                    employeeSchema.find({}).populate({path:"employeeData"})
                                    .findOne({employeeData:data._id})
                                    .then((employee)=>{

                                        if(employee == null)
                                        {
                                            let newEmployee=new employeeSchema({
                                                salary:request.body.employeeSalary,
                                                phone:request.body.employeePhone,
                                                position:request.body.employeePosition,
                                                employeeData:data._id,
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
                                            response.status(404).json({message:"This employee already exsists"})
                                        }
                                    })

                }
                else
                {
                    response.status(404).json({message:"This Email does not exsist or role does not employee"})
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
                clinicId:request.body.clinic_Id
            }
        }).then(result=>{
            response.status(200).json({message:"updated"});
        })
        .catch(error=>next(error))
}; 