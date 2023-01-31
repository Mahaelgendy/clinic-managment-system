const mongoose = require('mongoose')
require('./location') 

require('mongoose-sequence')

const clinicSchema = new mongoose.Schema({
    _id:{type:Number},
    doctor_id : {type:mongoose.Types.ObjectId, required:true , ref:'doctors'}, 
    clinic_location : AddressSchema,
    service_names:{type: Array , required:true}
}, {_id:false});


clinicSchema.plugin(AutoIncreament,{id:'clinicConter'})
mongoose.model('clinics' , clinicSchema)


