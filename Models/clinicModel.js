const mongoose = require('mongoose')
const AutoIncreament = require('mongoose-sequence')(mongoose);

const addres = require('./adressModel') 

const serviceSchema = new mongoose.Schema({
    name:{type:String , required:true},
    salary:{type:Number, required:true},
    doctor_id:{type:Number, required:true , ref:'doctors'},
    clinic_id: {type:Number, required:true , ref:'clinics'}
},{_id:false})

serviceSchema.plugin(AutoIncreament,{id:'serviceConter'})
mongoose.model('services' , serviceSchema)

/////////////////////////////////////

const clinicSchema = new mongoose.Schema({
    _id:{type:Number},
    clinic_location : addres.adressSchema
    },
    {_id:false}
);


clinicSchema.plugin(AutoIncreament,{id:'clinicConter'})
mongoose.model('clinics' , clinicSchema)


