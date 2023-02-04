const mongoose = require('mongoose')
const AutoIncreament = require('mongoose-sequence')(mongoose)

const medicineSchema = new mongoose.Schema({
    _id: { type: Number },
    medicineName: { type: String ,required:true},
    companyName: { type: String, required: true },
    speciality:{type:String , require},
    description: {type: String},
}, { _id: false }
)
medicineSchema.plugin(AutoIncreament ,{id:"medicineCounter"});


mongoose.model('medicines', medicineSchema)
