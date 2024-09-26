const mongoose = require('mongoose');

const ChannelHistoryScheema = new mongoose.Schema({
    inst_ID:{
        type:String,
        required:true
    },
    patient_ID: {
        type: String,
        required: true,
    },
    doctor_Name:{
        type:String,
        required:true
    },
    date:{
        type:Date,
    },
    sick: {
        type: String,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    },
    medicine: {
        type: String,
    },
    file: {
        type: String,
    },
  
});

const ChannelHistoryModel = mongoose.model("ChannelHistory", ChannelHistoryScheema);

module.exports = ChannelHistoryModel;
