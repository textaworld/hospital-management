const DoctorModel = require("../models/doctorModel");

const createDoctor = async (req, res) => {
  try {
    const {
      inst_ID,
      doctor_ID,
      name,
      specialization,
      doctorPhone,
      doctorEmail
    } = req.body;

    const newDoctor = new DoctorModel({
      inst_ID,
      doctor_ID,
      name,
      specialization,
      doctorPhone,
      doctorEmail
    });

    const savedDoctor = await newDoctor.save();
    res.json(savedDoctor);

  } catch (err) {
    console.error('Error saving doctor:', err.message); 
    res.status(500).json({ error: err.message });
  }
};


const getAllDoctors = (req, res) => {
  DoctorModel
    .find()
    .then((doctors) => res.json(doctors))
    .catch((err) => res.json({ error: err.message }));
};

const getDoctorById = (req, res) => {
  const doctor_ID = req.params.id;

  DoctorModel
    .findById(doctor_ID)
    .then((doctor) => {
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
      res.json(doctor);
    })
    .catch((err) => res.json({ error: err.message }));
};

const updateDoctor = (req, res) => {
  const doctorID = req.params.id;
  const {
    inst_ID,
    doctor_ID,
    specialization,
    doctorPhone,
    doctorEmail,
    name
  } = req.body;

  DoctorModel
    .findByIdAndUpdate(
      doctorID,
      {
        inst_ID,
        doctor_ID,
        specialization,
        doctorPhone,
        doctorEmail,
        name
      },
      { new: true }
    )
    .then((updatedDoctor) => {
      if (!updatedDoctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
      res.json(updatedDoctor);
    })
    .catch((err) => res.json({ error: err.message }));
};

const deleteDoctor = (req, res) => {
  const doctor_ID = req.params.id;
  console.log("docUD",doctor_ID)

  DoctorModel
    .findByIdAndDelete(doctor_ID)
    .then((deletedDoctor) => {
      if (!deletedDoctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
      res.json({ message: "Doctor deleted successfully" });
    })
    .catch((err) => res.json({ error: err.message }));
};

const getDoctorDetailsByDoctorID = async (req, res) => {
  const doctor_ID = req.params.id;

  try {
    const doctor = await DoctorModel.findOne({ _id: doctor_ID });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ doctor });
  } catch (error) {
    console.error("Error finding doctor:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllDoctorsByHospitalId = async (req, res) => {
  const { id } = req.params;

  try {
    const doctors = await DoctorModel
      .find({ inst_ID: id })
      .sort({ createdAt: -1 });

    if (!doctors || doctors.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No doctors found", data: null });
    }

    res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const searchDoctorByDoctor_ID = async (req, res) => {
  const { doctor_ID } = req.params;


  try {
    const doctor = await DoctorModel.findOne({ doctor_ID });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ phone: doctor.phone , name: doctor.name});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getDoctorDetailsByDoctorID,
  getAllDoctorsByHospitalId,
  searchDoctorByDoctor_ID
};
