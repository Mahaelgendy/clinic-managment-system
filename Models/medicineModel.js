const mongoose = require('mongoose')
const AutoIncreament = require('mongoose-sequence')(mongoose)

const medicineSchema = new mongoose.Schema({
    _id: { type: Number },
    medicineName: { type: string ,required:true},
    companyName: { type: string, required: true },
    description: {type: String},
}, { _id: false }
)
medicineSchema.plugin(AutoIncreament);


mongoose.model('medicines', medicineSchema)
