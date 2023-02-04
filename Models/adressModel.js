const mongoose = require('mongoose');

const adressSchema= new mongoose.Schema({
    city: String,
    street:String,
    building: Number
} ,{_id:false}
);

module.exports = {adressSchema}