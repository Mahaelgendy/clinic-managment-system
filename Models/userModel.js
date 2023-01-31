const mongoose = require('mongoose');

const adressSchema= new mongoose.Schema({
        city: String,
        street:String,
        building: String
    } ,{_id:false}
);

const userSchema = new mongoose.Schema({
    _id : {type :mongoose.Types.ObjectId , auto:true},
    fullName: {type:String , required:true},
    password: {type:String , required:true},
    email:{ type: String, unique: true, required:true, match:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/},
    age :{type : Number , required:true },
    gender:{type: String, enum: ['Femele','Male']},
    address: adressSchema,
    image:String,
});

mongoose.model("users",userSchema);