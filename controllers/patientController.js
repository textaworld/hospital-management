const PatientModel = require("../models/patient");
const PatientIDModel = require("../models/PatientIdModel");

const createPatient = async (req, res) => {
  try {
    const {
      inst_ID,
      patient_ID,
      name,
      email,
      age,
      address,
      phone,
      room,
      patientCount,
    } = req.body;

    // Check if patient_ID exists in PatientIDModel
    const existingPatientId = await PatientIDModel.findOne({ patient_ID, inst_ID });
    if (existingPatientId) {
      return res.status(400).json({ error: "Patient ID is already taken" });
    }

    // Check existing patient count
    const existingPatientCount = await PatientModel.countDocuments({ inst_ID });

    // If the existing count is equal to or greater than patientCount, stop adding new patients
    if (existingPatientCount >= patientCount) {
      return res.status(400).json({ error: "Patient limit reached. Cannot add more patients." });
    }

    // Create a PatientId object
    const newPatientId = new PatientIDModel({
      inst_ID,
      patient_ID
    });

    // Save the PatientId object
    await newPatientId.save();

    // Create a new patient in PatientModel
    const newPatient = new PatientModel({
      inst_ID,
      patient_ID,
      name,
      email,
      age,
      address,
      phone,
      room,
      patientCount,
    });

    const savedPatient = await newPatient.save();
    res.json(savedPatient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPatientIds = async (req, res) => {
  try {
    const patientIds = await PatientIDModel.find(); // Fetch all patient IDs from the database
    res.status(200).json(patientIds); // Return patient IDs as JSON response
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle errors
  }
};

const getAllPatients = (req, res) => {
  PatientModel
    .find()
    .then((patients) => res.json(patients))
    .catch((err) => res.json({ error: err.message }));
};

const getPatientById = (req, res) => {
  const patient_ID = req.params.id;
  console.log("Patient ID received:", patient_ID);

  PatientModel
    .findOne({ patient_ID }) 
    .then((patient) => {
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      console.log("Patient details:", patient); 
      res.json(patient);
    })
    .catch((err) => {
      console.error("Error retrieving patient:", err.message);
      res.status(500).json({ error: err.message });
    });
};

const updatePatient = (req, res) => {
  const patientId = req.params.id;
  const { patient_ID, name, email, age, address, phone, room } = req.body;

  PatientModel
    .findByIdAndUpdate(
      patientId,
      {
        patient_ID,
        name,
        email,
        age,
        address,
        phone,
        room,
      },
      { new: true }
    )
    .then((updatedPatient) => {
      if (!updatedPatient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.json(updatedPatient);
    })
    .catch((err) => res.json({ error: err.message }));
};

const deletePatient = (req, res) => {
  const patient_ID = req.params.id;

  PatientModel
    .findByIdAndDelete(patient_ID)
    .then((deletedPatient) => {
      if (!deletedPatient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.json({ message: "Patient deleted successfully" });
    })
    .catch((err) => res.json({ error: err.message }));
};

const getPatientDetailsByPatient_ID = async (req, res) => {
  const { patient_ID } = req.params;

  try {
    const patient = await PatientModel.findOne({ patient_ID });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ patient });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllPatientsByRoomID = async (req, res) => {
  const roomID = req.params.roomID;

  try {
    const patients = await PatientModel.find({ "room._id": roomID });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllPatientsByInsId = async (req, res) => {
  const { id } = req.params;

  try {
    const patients = await PatientModel
      .find({ inst_ID: id })
      .sort({ createdAt: -1 });

    if (!patients || patients.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No patients found", data: null });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Patients fetched successfully",
        data: patients,
      });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getAllPatientsByDiagnosis = async (req, res) => {
  const { id } = req.params;
  const { diagnosis } = req.query;

  try {
    const patients = await PatientModel.find({
      inst_ID: id,
      "room.diagnosis": diagnosis
    });

    if (!patients || patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No patients found for the given diagnosis",
        data: null
      });
    }

    // Extract phone numbers of patients
    const phoneNumbers = patients.map(patient => patient.phone);

    res.status(200).json({
      success: true,
      message: "Phone numbers of patients for the given diagnosis fetched successfully",
      data: phoneNumbers
    });
  } catch (error) {
    console.error("Error fetching patients by diagnosis:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const searchPatientByPatient_ID = async (req, res) => {
  const { patient_ID } = req.params;


  try {
    const patient = await PatientModel.findOne({ patient_ID });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ phone: patient.phone , name: patient.name});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPhoneNumbersByInstId = async (req, res) => {
  const inst_ID  = req.params.id;

  try {
    // Find patients by inst_ID
    const patients = await PatientModel.find({ inst_ID });

    // If no patients are found, return an appropriate message
    if (!patients || patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No patients found for the given inst_ID",
        data: null
      });
    }

    // Extract phone numbers from patients
    const phoneNumbers = patients.map(patient => patient.phone);

    // Return the list of phone numbers
    res.status(200).json({
      success: true,
      message: "Phone numbers fetched successfully",
      data: phoneNumbers
    });
  } catch (error) {
    // Handle any errors
    console.error("Error fetching phone numbers:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientDetailsByPatient_ID,
  getAllPatientsByRoomID,
  getAllPatientsByInsId,
  getAllPatientsByDiagnosis,
  searchPatientByPatient_ID,
  getPatientIds,
  getAllPhoneNumbersByInstId
};
