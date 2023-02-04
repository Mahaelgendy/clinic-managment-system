const mongoose = require('mongoose')
const AutoIncreament = require('mongoose-sequence')(mongoose)

const invoiceSchema = new mongoose.Schema({
    _id: { type: Number },
    doctor_id : {type:Number, required:true , ref:'doctors'}, 
    patient_id: { type: Number, required: true, ref: 'patients' },
    employee_id: { type: Number, required: true, ref: 'employees' },
    appointment_id: { type: Number, required: true, ref: 'appointments' },
    clinic_id: { type: Number, ref: 'clinics', required: true },
    paymentMethod: { type: String, enum: ['Cash', 'Credit Card'], required: true },
    paymentStatus: { type: String, enum: ['Total amount', 'Partial with insurance'], required: true },
    totalCost: { type: Number, required: true },
    actualPaid: { type: Number, required: true },
    date:{type:String , required:true},
    time:{type:String , required:true},

}, { _id: false }
)
invoiceSchema.plugin(AutoIncreament,{id: 'id_counter', inc_field: '_id'});

mongoose.model('invoices', invoiceSchema)

