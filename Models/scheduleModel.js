
const mongoose = require('mongoose');
const AutoIncreament = require('mongoose-sequence')(mongoose)

const scheduleSchema = new mongoose.Schema({
    _id:{type:Number},
    clinic_id:{type:Number , ref:'clinics' , required:false},
    doc_id:{type:Number , ref:'doctors' , required:true},
    date:{type:String , required:true},
    from:{type:Date , required:true},
    to :{type:Date , required:true},
    duration_in_minutes:{type:Number , required:true , default:30}
},{ _id:false}
);

scheduleSchema.plugin(AutoIncreament,{id:'schedulaCounter'});
mongoose.model('schedules' , scheduleSchema);
