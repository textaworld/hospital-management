const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    inst_ID:{
        type:String,
        required:true
    },
    patient_ID: {
        type: String,
        required: true,
    },
    status:{
        type:String,
        required:true
    },
    date:{
        type:Date,
    },
  
});

const CardModel = mongoose.model("Card", CardSchema);

module.exports = CardModel;
