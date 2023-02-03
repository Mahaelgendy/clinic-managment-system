const mongoose = require('mongoose')
const AutoIncreament = require('mongoose-sequence')(mongoose);

const addres = require('./adressModel') 

const service = new mongoose.Schema({
    name:{type:String , required:true},
    salay:{type:Number, required:true},
    doctor_id:{type:Number, required:true , ref:'doctor'}
})

const clinicSchema = new mongoose.Schema({
    _id:{type:Number},
    clinic_location : addres.adressSchema,
    service:[service]
    },
    {_id:false}
);


clinicSchema.plugin(AutoIncreament,{ _id:'clinicConter'})
mongoose.model('clinics' , clinicSchema)


