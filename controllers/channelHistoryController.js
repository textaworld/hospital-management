const ChannelHistoryModel = require("../models/ChannelHistory");
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Set up multer for file storage
 const storage = multer.memoryStorage(); // Store files in memory, or use diskStorage to save to disk

const upload = multer({ storage: storage });
const uploadFile = upload.single('file');
const createChannelHistory = async (req, res) => {
  try {
    const {
      inst_ID,
      patient_ID,
      doctor_Name,
      date,
      sick,
      description,
      medicine
    } = req.body;

    const file = req.file; // Access the uploaded file

    console.log("file", file);
    console.log("medicine", medicine);

    if (file) {
      console.log("Uploaded file name:", file.originalname);
      console.log("Uploaded file buffer:", file.buffer); // This is where the file data is stored
    }

    const newChannelHistory = new ChannelHistoryModel({
      inst_ID,
      patient_ID,
      doctor_Name,
      date,
      sick,
      image: req.body.image, // Assuming 'image' is also in the body, not a file
      description,
      medicine,
      file: file ? file.originalname : null, // Store the file name or handle it accordingly
    });

    const savedChannelHistory = await newChannelHistory.save();
    res.json(savedChannelHistory);

  } catch (err) {
    console.error('Error saving channel history:', err.message); 
    res.status(500).json({ error: err.message });
  }
};

const downloadFile = (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '../uploads', fileName);

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
  ChannelHistoryModel
    .find()
    .then((channelHistories) => res.json(channelHistories))
    .catch((err) => res.json({ error: err.message }));
};

const getChannelHistoryById = (req, res) => {
  const channelHistory_ID = req.params.id;

  ChannelHistoryModel
    .findById(channelHistory_ID)
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
      file
  } = req.body;

  ChannelHistoryModel
    .findByIdAndUpdate(
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
      file
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

  ChannelHistoryModel
    .findByIdAndDelete(channelHistory_ID)
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

  ChannelHistoryModel
    .find({ patient_ID })
    .then((channelHistories) => {
      if (channelHistories.length === 0) {
        return res.status(404).json({ error: "No channel history found for this patient" });
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
  uploadFile
};
