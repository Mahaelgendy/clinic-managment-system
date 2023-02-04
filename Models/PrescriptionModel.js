const mongoose = require('mongoose')
const AutoIncreament = require('mongoose-sequence')(mongoose);


const prespictionSchema = new mongoose.Schema({
    _id:{type:Number},
    diagnosis:{type:String },
    currentExamination:{type:Date , required:true},
    nextExamination:{type:Date, required:true},
    doctor_id : {type:Number, required:true , ref:'doctors'}, 
    patient_id :{type: Number , required:true , ref :'patients'},
    medicine_id :{type :Array , required:true}//, ref: 'medicines'}
}, {_id:false});


prespictionSchema.plugin(AutoIncreament,{id:'prespictionCounter'})
mongoose.model('prespictions' , prespictionSchema)

