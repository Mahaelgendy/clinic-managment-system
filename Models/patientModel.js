
const mongoose = require ('mongoose');

const AutoIncreament = require ('mongoose-sequence')(mongoose);
const patientSchema= new mongoose.Schema({
    
    _patientId:{type:Number},
    status:{type:String,Enumerator:['First Time','fllow Up'],required:true},
    history:{type:String},
    height:{type:Number},
    weight:{type:Number},
    hasInsurance:{type:Boolean,default:false},
    phone:{type:Number ,required:true ,match:/^01[0-2,5]\d{8}$/},
    patientData:{type:mongoose.Types.ObjectId,ref:'users'},
    
});

patientSchema.plugin(AutoIncreament,{id:'patientCounter'});
mongoose.model('patients',patientSchema);
