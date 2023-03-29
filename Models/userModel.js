const mongoose = require('mongoose');
const address = require('./adressModel');

const userSchema = new mongoose.Schema({
    _id : {type :mongoose.Types.ObjectId , auto:true},
    fullName: {type:String , required:true, matchRegx:/^[a-zA-Z]+((['_,. -][a-zA-Z ])?[a-zA-Z]*)*$/,unique:true},
    password: {type:String , required:true},
    email:{ type: String, unique: true, required:true, match:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/},
    age :{type : Number , required:true },
    gender:{type: String, enum: ['Female','Male']},
    address: {type:address.adressSchema},
    role:{type: String, required: true, enum: ["admin", "doctor", "patient" , "employee"], default:'patient'},
    // image:{type:String },
   
});

mongoose.model("users",userSchema);

