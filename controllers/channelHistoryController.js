const ChannelHistoryModel = require("../models/ChannelHistory");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const mongoose = require("mongoose");
const PdfDetails = require("../models/pdfModel");

const createChannelHistory = async (req, res) => {
  try {
    // Uploading file using multer
    // Extract the form fields
    const {
      channel_ID,
      inst_ID,
      patient_ID,
      doctor_Name,
      date,
      sick,
      description,
      medicine,
    } = req.body;

    // Create a new ChannelHistory with PDF details if present
    const newChannelHistory = new ChannelHistoryModel({
      inst_ID,
      channel_ID,
      patient_ID,
      doctor_Name,
      date,
      sick,
      image: req.body.image,
      description,
      medicine,
    });

    const savedChannelHistory = await newChannelHistory.save();
    console.log("savedChannelHistory", savedChannelHistory);
    res.json(savedChannelHistory);
  } catch (err) {
    console.error("Error saving channel history:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const downloadFile = (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "../uploads", fileName);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: "File not found" });
    }

    // If the file exists, send it as a response
    res.download(filePath, fileName, (downloadErr) => {
      if (downloadErr) {
        res.status(500).json({ error: "Error downloading the file" });
      }
    });
  });
};

const getAllChannelHistories = (req, res) => {
  ChannelHistoryModel.find()
    .then((channelHistories) => res.json(channelHistories))
    .catch((err) => res.json({ error: err.message }));
};

const getChannelHistoryById = (req, res) => {
  const channelHistory_ID = req.params.id;

  ChannelHistoryModel.findById(channelHistory_ID)
    .then((channelHistory) => {
      if (!channelHistory) {
        return res.status(404).json({ error: "Channel history not found" });
      }
      res.json(channelHistory);
    })
    .catch((err) => res.json({ error: err.message }));
};

const updateChannelHistory = (req, res) => {
  const channelHistory_ID = req.params.id;
  const {
    inst_ID,
    patient_ID,
    doctor_Name,
    date,
    sick,
    image,
    description,
    medicine,
    file,
  } = req.body;

  ChannelHistoryModel.findByIdAndUpdate(
    channelHistory_ID,
    {
      inst_ID,
      patient_ID,
      doctor_Name,
      date,
      sick,
      image,
      description,
      medicine,
      file,
    },
    { new: true }
  )
    .then((updatedChannelHistory) => {
      if (!updatedChannelHistory) {
        return res.status(404).json({ error: "Channel history not found" });
      }
      res.json(updatedChannelHistory);
    })
    .catch((err) => res.json({ error: err.message }));
};

const deleteChannelHistory = (req, res) => {
  const channelHistory_ID = req.params.id;

  ChannelHistoryModel.findByIdAndDelete(channelHistory_ID)
    .then((deletedChannelHistory) => {
      if (!deletedChannelHistory) {
        return res.status(404).json({ error: "Channel history not found" });
      }
      res.json({ message: "Channel history deleted successfully" });
    })
    .catch((err) => res.json({ error: err.message }));
};

const getChannelHistoryByPatient_ID = (req, res) => {
  const patient_ID = req.params.id;

  ChannelHistoryModel.find({ patient_ID })
    .then((channelHistories) => {
      if (channelHistories.length === 0) {
        return res
          .status(404)
          .json({ error: "No channel history found for this patient" });
      }
      res.json(channelHistories);
    })
    .catch((err) => res.json({ error: err.message }));
};

module.exports = {
  createChannelHistory,
  getAllChannelHistories,
  getChannelHistoryById,
  updateChannelHistory,
  deleteChannelHistory,
  getChannelHistoryByPatient_ID,
  downloadFile,
};
