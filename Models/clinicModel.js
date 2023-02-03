const mongoose = require('mongoose')
const AutoIncreament = require('mongoose-sequence')(mongoose);

const addres = require('./adressModel') 

const clinicSchema = new mongoose.Schema({
    _id:{type:Number},
    doctor_id : {type:Number , ref:'doctors'}, 
    clinic_location : addres.adressSchema,
    service_names:{type: Array , required:true}
    }, 
    {_id:false}
);


clinicSchema.plugin(AutoIncreament,{ _id:'clinicConter'})
mongoose.model('clinics' , clinicSchema)


