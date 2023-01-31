
const mongoose = require('mongoose');

const AutoIncreament = require('mongoose-sequence')(mongoose)

const schedule = new mongoose.Schema({
    clinic_id:{type:Number},
    date:{type:Date},
    from:{type:Date},
    to :{type:Date},
    duration:{type:Date}
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