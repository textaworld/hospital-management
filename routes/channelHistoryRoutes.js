const express = require('express');
const router = express.Router();
const multer = require('multer');
const channelHistoryController = require('../controllers/channelHistoryController');

const storage = multer.memoryStorage(); // or use diskStorage to save the file to disk
const upload = multer({ storage: storage })
// Create a new channel history
router.post("/createChannelHistory", upload.single('file'), channelHistoryController.createChannelHistory);

// Get all channel histories
router.get("/getAllChannelHistories", channelHistoryController.getAllChannelHistories);

// Get a specific channel history by ID
router.get("/getChannelHistoryById/:id", channelHistoryController.getChannelHistoryById);

// Update a specific channel history by ID
router.put("/updateChannelHistory/:id", channelHistoryController.updateChannelHistory);

// Delete a specific channel history by ID
router.delete("/deleteChannelHistory/:id", channelHistoryController.deleteChannelHistory);

router.get("/getChannelHistoryByPatient_ID/:id", channelHistoryController.getChannelHistoryByPatient_ID);

router.get("/downloadFile/:fileName", channelHistoryController.downloadFile);

module.exports = router;
