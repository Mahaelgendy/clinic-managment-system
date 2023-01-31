
const mongoose = require ('mongoose');

const employeeSchema= new mongoose.Schema({

    _employeeId:{type:Number},
    _employeeName:{type:String,ref:'users'},
    _age:{type:Number ,ref:'users'},
    _gender:{type:String ,ref:'users'},
    _clinicId:{type:Number,ref:'clinics'}

});

mongoose.model('employees',employeeSchema)