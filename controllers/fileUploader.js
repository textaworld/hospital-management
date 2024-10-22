const express = require("express");
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const router = express.Router();
const PdfModel = require("../models/pdfModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../files'); // Adjust path if necessary
    
    // Create the directory if it doesn't exist
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        console.error("Failed to create directory:", err);
        return cb(err, dir);
      }
      cb(null, dir); // Provide the directory for multer to use
    });
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname); // Generate a unique filename
  },
});

const upload = multer({ storage: storage });

// Handle file uploads
router.post("/upload-files", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  
  const fileName = req.file.filename;
  const channel_ID = req.body.channel_ID; // Assuming channel_ID is sent in the request body

//   console.log("channel_ID",channel_ID)
  
  try {
    await PdfModel.create({ pdf: fileName, channel_ID:channel_ID }); // Save channel_ID along with the file
    res.json({ message: "File uploaded successfully" });
  } catch (err) {
    console.error("Error saving to database:", err);
    res.status(500).json({ error: "Failed to save file to database" });
  }
});

// Get all files
router.get("/get-files", async (req, res) => {
  try {
    const data = await PdfModel.find({});
    res.send({ status: "ok", data: data });
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).send({ status: "error", message: "Failed to fetch files" });
  }
});

// Get files by channel_ID
router.get("/getFilesByChannelID/:channel_ID", async (req, res) => {
    const channel_ID = req.params.channel_ID; // Change from req.params.id to req.params.channel_ID
  
    console.log("channel_ID", channel_ID);
    try {
      const data = await PdfModel.find({ channel_ID });
      res.send({ status: "ok", data: data });
    } catch (err) {
      console.error("Error fetching files by channel_ID:", err);
      res.status(500).send({ status: "error", message: "Failed to fetch files by channel_ID" });
    }
  });
  

// Export the router
module.exports = router;
