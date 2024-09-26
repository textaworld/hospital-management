const mongoose = require('mongoose');

const PatienttSchema = new mongoose.Schema({
    inst_ID:{
        type:String,
        required:true
    },
    patient_ID: {
        type: String,
        required: true,
        unique: true  
    },
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    age: {
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    // classs: [
    //     {
    //       _id: {
    //         type: String,
    //       },
    //       subject: {
    //         type: String,
    //       },
    //     },
    //   ],      
      
    // stdCount:{
    //     type:Number,
    // }
    
});

const PatientModel = mongoose.model("Patients", PatienttSchema);

module.exports = PatientModel;
