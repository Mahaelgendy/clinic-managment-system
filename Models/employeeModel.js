
const mongoose = require ('mongoose');

const AutoIncreament = require('mongoose-sequence')(mongoose);

const employeeSchema= new mongoose.Schema({

    _id:{type:Number},
    employeeData:{type:mongoose.Types.ObjectId , ref:'users'},
    clinicId:{type:Number ,ref:"clinics"},
    salary:{type:Number,required:true},
    phone:{type:Number,match:/^01[0-2,5]\d{8}$/},
    position:{type:String ,Enumerator:['receptionist','assistant'],required:true, default:"receptionist"}

},{_id:false}
);

employeeSchema.plugin(AutoIncreament,{id:'employeeCounter'});
mongoose.model('employees',employeeSchema);