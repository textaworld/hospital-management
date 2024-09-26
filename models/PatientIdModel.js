const mongoose = require('mongoose');

const PatientIDSchema = new mongoose.Schema({
    inst_ID:{
        type:String,
        required:true
    },
    patient_ID: {
        type: String,
        required: true,
        unique: true  
    },

    
});

const PatientIDModel = mongoose.model("PatientIDs", PatientIDSchema);

module.exports = PatientIDModel;
