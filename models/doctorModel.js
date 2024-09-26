const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    inst_ID:{
        type:String
    },
    doctor_ID:{
        type:String
    },
    name:{
        type:String
    },
    specialization:{
        type:String
    },
    doctorPhone:{
        type:Number
    },
    doctorEmail:{
        type:String
    },
    // doctorFees :{
    //     type:Number
    // }
});

const DoctorModel = mongoose.model("Doctor", DoctorSchema);

module.exports = DoctorModel;

