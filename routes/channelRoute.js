const express = require('express');
const router = express.Router();

const channelController = require('../controllers/channelController');


// Create a new channel
router.post("/createChannel", channelController.createChannel);

// Get all channels
router.get("/getAllChannels", channelController.getAllChannels);

// Get a specific channel by ID
router.get("/getChannelById/:id", channelController.getChannelById);

// Update a specific channel by ID
router.put("/updateChannel/:id", channelController.updateChannel);

// Delete a specific channel by ID
router.delete("/deleteChannel/:id", channelController.deleteChannel);

router.get('/getAllChannelsByHospitalId/:id', channelController.getAllChannelsByHospitalId);

router.get('/getAllChannelsByPatientId/:id', channelController.getAllChannelsByPatientId);


module.exports = router;
