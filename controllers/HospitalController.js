const mongoose = require("mongoose");
const Hospital = require("../models/HospitalModel");

// --------- Create instritute
const createInstritute = async (req, res) => {
  const {
    name,
    email,
    count,
    notification,
    image,
    instPackage,
    packageStatus,
    currentTime,
    expireTime,
    topUpPrice,
    smsPrice,
    stdCardcardStatus,
    phone
  } = req.body;

  let emptyFields = [];

  if (!name) {
    emptyFields.push("Name");
  }
  if (!email) {
    emptyFields.push("Email");
  }
  if (!count) {
    emptyFields.push("Count");
  }
  if (!notification) {
    emptyFields.push("Notification");
  }
  if (!image) {
    emptyFields.push("Image");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  // add doc to db
  try {
    const user_id = req.user._id;
    const hospital = await Hospital.create({
      name,
      email,
      count,
      notification,
      uid: user_id,
      image,
      instPackage,
      packageStatus,
      currentTime,
      expireTime,
      topUpPrice,
      smsPrice,
      stdCardcardStatus,
      phone

    });
    res.status(200).json(hospital);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// --------- Get all instritute
const getAllInstitutes = async (req, res) => {
  //const user_id = req.user._id

  try {
    const hospitals = await Hospital.find().sort({ createdAt: -1 });

    if (!hospitals || hospitals.length === 0) {
      return res.status(404).json({ message: "No hospitals found" });
    }

    res.status(200).json(hospitals);
  } catch (error) {
    

    res.status(500).json({ error: "Internal Server Error" });
  }
};

// --------- Get one instritute
const getInstitute = async (req, res) => {
  const { id } = req.params;

  try {
    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({ error: "No such hospital" });
    }

    res.status(200).json(hospital);
  } catch (error) {
    // Log the error for debugging purposes
    

    res.status(500).json({ error: "Internal Server Error" });
  }
};

// --------- update a Institute
const updateInstitute = async (req, res) => {
  const { id } = req.params;

  try {
    const hospital = await Hospital.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!hospital) {
      return res.status(404).json({ error: "No such Hospital found" });
    }

    res.status(200).json(hospital);
  } catch (error) {
    // Log the error for debugging purposes
    

    res.status(500).json({ error: "Internal Server Error" });
  }
};

// --------- delete a Institute
const deleteInstitute = async (req, res) => {
  const { id } = req.params;

  try {
    const hospital = await Hospital.findOneAndDelete({ _id: id });

    if (!hospital) {
      return res.status(404).json({ error: "No such Hospital found" });
    }

    res.status(200).json({
      message: "hospital deleted successfully",
      deletedhospital: hospital,
    });
  } catch (error) {
    // Log the error for debugging purposes
    

    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const searchDoctorByDoctor_ID = async (req, res) => {
//   const { doctor_ID } = req.params;


//   try {
//     const doctor = await DoctorModel.findOne({ doctor_ID });
//     if (!doctor) {
//       return res.status(404).json({ message: 'Doctor not found' });
//     }
//     res.json({ phone: doctor.phone , name: doctor.name});
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

module.exports = {
  createInstritute,
  getAllInstitutes,
  getInstitute,
  updateInstitute,
  deleteInstitute,
};
