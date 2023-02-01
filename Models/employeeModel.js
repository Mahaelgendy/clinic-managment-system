
const mongoose = require ('mongoose');

const employeeSchema= new mongoose.Schema({

    _employeeId:{type:Number},
    _employeeData:{type:mongoose.Types.ObjectId,ref:'users'},
    _clinicId:{type:Number,ref:'clinics'}

});

mongoose.model('employees',employeeSchema)