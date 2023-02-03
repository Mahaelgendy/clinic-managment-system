
const mongoose = require('mongoose');
const AutoIncreament = require('mongoose-sequence')(mongoose);

const appointmentSchema = new mongoose.Schema({
    _id:{type:Number},
    clinic_id:{type:Number , ref:'clinics' , required:true},
    doctor_id:{type:Number , ref:'doctors' , required:true},
    patient_id:{type:Number , ref:'patients', required:true},
    employee_id:{type:Number , ref:'employees' , require:true},
    date:{type:String , required:true},
    time:{type:Date , required:true},
    status:{type:String , enum:['First Time' , 'Follow Up'] , required:true},
    reservation_method:{type:String , enum:['Online' , 'Offline']}
},{_id:false}
);

appointmentSchema.plugin(AutoIncreament , {_id:'appointmentCounter'});

mongoose.model('appointments' , appointmentSchema);