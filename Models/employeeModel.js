
const mongoose = require ('mongoose');

const AutoIncreament = require('mongoose-sequence')(mongoose);

const employeeSchema= new mongoose.Schema({

    _id:{type:Number},
    employeeData:{type:mongoose.Types.ObjectId,ref:'users'},
    clinicId:{type:Number,ref:'clinics'}

},{_id:false}
);

employeeSchema.plugin(AutoIncreament);
mongoose.model('employees',employeeSchema);