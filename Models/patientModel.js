
const mongoose = require ('mongoose');

const patientSchema= new mongoose.Schema({
    
    _patientId:{type:Number},
    _patientName:{type:String ,length:{max:10,min:3}},
    _status:{type:String,Enumerator:['First Time','fllow Up'],required:true},
    _history:{type:String},
    _height:{type:Number},
    _weight:{type:Number},
    _hasInsurance:{type:Boolean},
    _phone:{type:Number ,required:true ,match:/^01[0-2,5]\d{8}$/},
    _patientData:{type:mongoose.Types.ObjectId,ref:'users'},

});

mongoose.model('patients',patientSchema)
