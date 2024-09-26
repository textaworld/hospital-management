const mongoose = require('mongoose');

const ChannelScheema = new mongoose.Schema({
    inst_ID:{
        type:String,
        required:true
    },
    channel_ID: {
        type: String,
        required: true,
    },
    patient_ID: {
        type: String,
        required: true,
    },
    doctor_ID:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type:String
    },
    room:{
        type:String
    }

    
});

const ChannelModel = mongoose.model("Channels", ChannelScheema);

module.exports = ChannelModel;
