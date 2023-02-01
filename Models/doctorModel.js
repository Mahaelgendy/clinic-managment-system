
const mongoose = require('mongoose');

const AutoIncreament = require('mongoose-sequence')(mongoose)

const schedule = new mongoose.Schema({
    clinic_id:{type:Number , ref:'clinics' , required:true},
    date:{type:Date , required:true},
    from:{type:Date , required:true},
    to :{type:Date , required:true},
    duration:{type:Date , required:true}
},{_id:fales}
);
const doctorSchema = new mongoose.Schema({
    _id:{type:Number},
    ownData:{type:mongoose.Types.ObjectId , ref:'users'},
    specialization:{type:String, required:true},
    price:{type:Number},
    schedules:[schedule]
},{ _id:false}
);

doctorSchema.plugin(AutoIncreament,{id:'doctorCounter'});
mongoose.model('doctors' , doctorSchema);