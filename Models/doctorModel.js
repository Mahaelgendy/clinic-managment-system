
const mongoose = require('mongoose');

const AutoIncreament = require('mongoose-sequence')(mongoose)

const scheduleSchema = new mongoose.Schema({
    _id:{type:Number},
    clinic_id:{type:Number , ref:'clinics' , required:true},
    doc_id:{type:Number , ref:'doctors' , required:true},
    date:{type:Date , required:true},
    from:{type:String , required:true},
    to :{type:String , required:true},
    duration:{type:String , required:true}
},{ _id:false}
);

scheduleSchema.plugin(AutoIncreament,{id:'schedulaCounter'});
mongoose.model('schedules' , scheduleSchema);

//--------------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------//

const doctorSchema = new mongoose.Schema({
    _id:{type:Number},
    userData:{type:mongoose.Types.ObjectId , ref:'users'},
    specialization:{type:String, required:true},
    price:{type:Number},
    doc_schedules:[{type:Number , ref:'schedules'}]
},{ _id:false}
);

doctorSchema.plugin(AutoIncreament,{id:'doctorCounter'});
mongoose.model('doctors' , doctorSchema);