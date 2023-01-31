
const mongoose = require ('mongoose');

const patientSchema= new mongoose.Schema({
    
    _patientId:{type:Number},
    _patientName:{type:String ,ref:'users'},
    _status:{type:String,Enumerator:['First Time','fllow Up'],required:true},
    _history:{type:String},
    _height:{type:Number},
    _weight:{type:Number},
    _phone:{type:Number ,required:true ,match:/^01[0-2,5]\d{8}$/},
    _gender:{type:String ,ref:'users'},
    _age:{type:Number ,ref:'users'}
});

mongoose.model('patients',patientSchema)
