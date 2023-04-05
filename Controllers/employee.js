
const {request,response} = require("express");
const mongoose = require("mongoose");

require("../Models/userModel");
require("../Models/employeeModel");
require("../Models/clinicModel");

const userSchema = mongoose.model("users");
const employeeSchema = mongoose.model("employees");
const clinicSchema = mongoose.model("clinics");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const sortEmployees = (data,query)=>{
    let sortBy = query.sortBy||'salary';
    let order = query.order ||"asc";
    let orderValue = order ==="asc"? 1:-1

    if (sortBy=='fullName' || sortBy == 'fullname'){
        data.sort((a, b) => {
            if (a.userData.fullName < b.userData.fullName) {
                return -1*orderValue
            }
            if (a.userData.fullName > b.userData.fullName) {
                return 1*orderValue
            }
            return 0;
        });
    }

    else
    {    
        return data.sort((a,b)=>{
            if(a[sortBy]<b[sortBy]) return -1*orderValue;
            if(a[sortBy]>b[sortBy]) return 1*orderValue;
        });
    }
};

module.exports.getAllEmployees = async (request,response,next)=>{
    
    const query = {}; 
    if(request.query.id) query._id = Number(request.query.id);
    if(request.query.salary) query.salary = Number(request.query.salary);
    if(request.query.position) query.position = request.query.position

    const page = request.query.page *1 || 1;
    const limit = request.query.limit *1 || 3;
    const skip =(page - 1) * limit;

   employeeSchema.find(query).populate({path:"employeeData",select:{fullName:1,age:1,gender:1,email:1}})
                            .populate({path:"clinicId"}).skip(skip).limit(limit)
                            .then((data)=>{
                           let employeeAfterSort= sortEmployees(data, request.query)
                                response.status(200).json(employeeAfterSort);
                            }) 
                            .catch((error)=>next(error));
};

module.exports.addEmployee =async (request, response, next)=>{
    let employeeExists = await userSchema.findOne({email:request.body.email});

    
    
    if(employeeExists)
    {
        return response.status(400).json({message:"Employee  already exists"});
    }

    else
    {
        const password = request.body.password

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        const empRole = "employee"
        
        const user = new userSchema({
            fullName:request.body.fullName,
            password:hash,
            email:request.body.email,
            age:request.body.age,
            gender:request.body.gender,
            address:request.body.address,
            role:empRole,
            // image:request.file.path
        });
        user.save()
            .then((result)=>{
                    console.log(result);
                const newEmployee = new employeeSchema({
                    employeeData:result._id,
                    salary:request.body.salary,
                    phone:request.body.phone,
                    position:request.body.position,
                    clinicId:request.body.clinicId,
                });
                newEmployee.save()
                            .then(()=>{
                                response.status(200).json({message:"New employee added successfully"});
                            })
                            .catch(err=>{
                                userSchema.deleteOne({email:email})
                                .then()
                                next(err)})
            })
            .catch((error)=>next(error));
        
    }
}

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
    employeeSchema.findOne({_id:request.params.id}).populate({path:"employeeData",select:{fullName:1,age:1,gender:1,email:1}})
                  .then((data)=>{
                        if(data!=null)
                        {
                            console.log((request.id ))
                            console.log(data.employeeData._id)
                            if(request.role == "employee" && (data.employeeData._id == request.id) ){
                                console.log("you are employee , authemticated")
                                response.status(200).json(data);
                            }
                            else if(request.role == "admin"){
                                console.log("you are admin , authourized")
                                response.status(200).json(data);
                            }
                            else{
                                response.json({message:"You aren't authourized to see this data"});

                            }

                        }
                        else
                        {
                            response.json({message:"Employee not Found"});
                        }
                  })
                  .catch(error=>next(error));
};

module.exports.getEmployeeByEmail = (request, response, next)=>{
    const email = request.params.email;

    userSchema.findOne({email:email})
                .then((userData)=>{
                    employeeSchema.findOne({employeeData:userData._id})
                                    .populate({path:"employeeData"})
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
                })
                  .catch(error=>next(error));
};
module.exports.getEmployeeByUserId = (request, response, next)=>{
    employeeSchema.findOne({employeeData:request.params.id}).populate({path:"employeeData",select:{fullName:1,age:1,gender:1,email:1}})
    .then((data)=>{
          if(data!=null)
          {
              console.log((request.id ))
              console.log(data.employeeData._id)
              if(request.role == "employee" && (data.employeeData._id == request.id) ){
                  console.log("you are employee , authemticated")
                  response.status(200).json(data);
              }
              else if(request.role == "admin"){
                  console.log("you are admin , authourized")
                  response.status(200).json(data);
              }
              else{
                  response.json({message:"You aren't authourized to see this data"});
              }
          }
          else
          {
              response.json({message:"Employee not Found"});
          }
    })
    .catch(error=>next(error));
};

exports.getEmployeeByName = (request, response , next)=>{
    const fullName = request.params.fullName;
    
    userSchema.findOne({fullName:fullName})
    .then(res=>{
        console.log(res);
        employeeSchema.findOne({employeeData:res._id})
        .populate({path:"employeeData"})
            .then((data)=>{
                response.status(200).json(data);
            })
    })
    .catch(err=>next(err))
}

module.exports.updateEmployee = (request, response, next)=>{
        employeeSchema.findByIdAndUpdate({
            _id:request.params.id
        },
        {
            $set:{
                salary:request.body.salary,
                phone:request.body.phone,
                position:request.body.position,
                clinicId:request.body.clinicId,
                // image:request.file.path
            }
        }).then(result=>{
            response.status(200).json({message:"updated"});
        })
        .catch(error=>next(error))
}; 