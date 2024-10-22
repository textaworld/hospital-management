const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  pdf: {
    type: String,
    required: true,
  },
  channel_ID: {
    type: String,
    required: true,
  },

});

const PdfModel = mongoose.model("Pdf", pdfSchema);

module.exports = PdfModel;
