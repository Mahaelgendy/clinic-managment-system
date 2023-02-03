
const mongoose = require ('mongoose');

const AutoIncreament = require('mongoose-sequence')(mongoose);

const employeeSchema= new mongoose.Schema({

    _employeeId:{type:Number},
    employeeData:{type:mongoose.Types.ObjectId,ref:'users'},
    clinicId:{type:Number,ref:'clinics'}

});

employeeSchema.plugin(AutoIncreament,{id:'employeeCounter'});
mongoose.model('employees',employeeSchema);