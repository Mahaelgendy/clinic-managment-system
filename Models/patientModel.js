
const mongoose = require ('mongoose');

const AutoIncreament = require ('mongoose-sequence')(mongoose);
const patientSchema= new mongoose.Schema({
    
    _id:{type:Number},
    status:{type:String,Enumerator:['First Time','fllow Up'],required:true, default:"first Time"},
    history:{type:String},
    height:{type:Number},
    weight:{type:Number},
    hasInsurance:{type:Boolean,default:false},
    phone:{type:Number ,required:true ,match:/^01[0-2,5]\d{8}$/},
    patientData:{type:mongoose.Types.ObjectId,ref:'users'},
    
}
);
// ,{_id:false}
// patientSchema.plugin(AutoIncreament);

mongoose.model("patients",patientSchema);
