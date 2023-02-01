const mongoose = require('mongoose')

require('mongoose-sequence')

const prespictionSchema = new mongoose.Schema({
    _id:{type:Number},
    doctor_id : {type:Number, required:true , ref:'doctors'}, 
    patient_id :{type: Number , required:true , ref :'patients'},
    medicine_id :{type :Array , required:true, ref: 'medicines'}
}, {_id:false});


prespictionSchema.plugin(AutoIncreament,{id:'prespictionCounter'})
mongoose.model('prespictions' , prespictionSchema)


