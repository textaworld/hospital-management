const ChannelModel = require("../models/channelModel");

const createChannel = async (req, res) => {
  try {
    const {
      inst_ID,
      channel_ID,
      patient_ID,
      doctor_ID,
      date,
      time,
      room,
    } = req.body;

    const newChannel = new ChannelModel({
      inst_ID,
      channel_ID,
      patient_ID,
      doctor_ID,
      date,
      time,
      room
    });
    console.log("Chanel",newChannel)
    const savedChannel = await newChannel.save();
    res.json(savedChannel);

  } catch (err) {
    console.error('Error saving channel:', err.message); // Log the error for debugging
    res.status(500).json({ error: err.message }); // Send a proper HTTP status code
  }
};

const getAllChannels = (req, res) => {
  ChannelModel
    .find()
    .then((channels) => res.json(channels))
    .catch((err) => res.json({ error: err.message }));
};

const getChannelById = (req, res) => {
  const channel_ID = req.params.id;

  ChannelModel
    .findById(channel_ID)
    .then((channel) => {
      if (!channel) {
        return res.status(404).json({ error: "Channel not found" });
      }
      res.json(channel);
    })
    .catch((err) => res.json({ error: err.message }));
};

const updateChannel = (req, res) => {
  const channelID = req.params.id;
  const {
    inst_ID,
    channel_ID,
    patient_ID,
    doctor_ID,
    date,
    time,
    room
  } = req.body;

  ChannelModel
    .findByIdAndUpdate(
      channelID,
      {
        inst_ID,
        channel_ID,
        patient_ID,
        doctor_ID,
        date,
        time,
        room
      },
      { new: true }
    )
    .then((updatedChannel) => {
      if (!updatedChannel) {
        return res.status(404).json({ error: "Channel not found" });
      }
      res.json(updatedChannel);
    })
    .catch((err) => res.json({ error: err.message }));
};

const deleteChannel = (req, res) => {
  const channel_ID = req.params.id;

  ChannelModel
    .findByIdAndDelete(channel_ID)
    .then((deletedChannel) => {
      if (!deletedChannel) {
        return res.status(404).json({ error: "Channel not found" });
      }
      res.json({ message: "Channel deleted successfully" });
    })
    .catch((err) => res.json({ error: err.message }));
};

const getAllChannelsByHospitalId = async (req, res) => {
  const { id } = req.params;
  try {
    const channels = await ChannelModel
      .find({ inst_ID: id })
      .sort({ createdAt: -1 });

    if (!channels || channels.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No channels found", data: null });
    }

    res.status(200).json({
      success: true,
      message: "Channels fetched successfully",
      data: channels,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getPatientAndDoctorByChannelId = async (req, res) => {
  const channel_ID = req.params.id;

  try {
    const channel = await ChannelModel.findById(channel_ID).select('patient_ID doctor_ID');
    
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    res.json(channel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPatientAndDoctorByChannelId,
};

const getAllChannelsByPatientId = async (req, res) => {
  const  patient_ID  = req.params.id;
  console.log("patientID",patient_ID)
  try {
    const channels = await ChannelModel.find({ patient_ID }).sort({ createdAt: -1 });

    if (!channels || channels.length === 0) {
      return res.status(404).json({ success: false, message: "No channels found for this patient", data: null });
    }

    res.status(200).json({
      success: true,
      message: "Channels fetched successfully",
      data: channels,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
module.exports = {
  createChannel,
  getAllChannels,
  getChannelById,
  updateChannel,
  deleteChannel,
  getAllChannelsByHospitalId,
  getPatientAndDoctorByChannelId,
  getAllChannelsByPatientId
};
