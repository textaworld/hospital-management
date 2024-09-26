const express = require('express');
const router = express.Router();
const requireAuth = require("../middleware/requirAuthAdmin");

const doctorController = require('../controllers/doctorController');

router.use(requireAuth);


router.post("/createDoctor", doctorController.createDoctor);

router.get("/getAllDoctors", doctorController.getAllDoctors);

// Get a specific doctor by ID
router.get("/getDoctorById/:id", doctorController.getDoctorById);

// Update a specific doctor by ID
router.put("/updateDoctor/:id", doctorController.updateDoctor);

// Delete a specific doctor by ID
router.delete("/deleteDoctor/:id", doctorController.deleteDoctor);

router.get('/getDoctorDetailsByDoctorID/:id', doctorController.getDoctorDetailsByDoctorID);

router.get('/getAllDoctorsByHospitalId/:id', doctorController.getAllDoctorsByHospitalId);

router.get('/searchDoctorByDoctor_ID/:doctor_ID', doctorController.searchDoctorByDoctor_ID);


module.exports = router;
