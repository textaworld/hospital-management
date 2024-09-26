const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    inst_ID: {
        type: String,
        required: true
    },
    channel_ID: {
        type: String,
        required: true
    },
    patient_ID: {
        type: String,
        required: true
    },
    doctor_ID: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },

});

const PaymentModel = mongoose.model("Payment", PaymentSchema);

module.exports = PaymentModel;
