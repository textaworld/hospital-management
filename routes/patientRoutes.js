const express = require('express');
const router = express.Router();
const requireAuth = require("../middleware/requirAuthAdmin");

const patientController = require('../controllers/patientController');

router.use(requireAuth);

router.post("/createPatient", patientController.createPatient);

router.get("/getAllPatients", patientController.getAllPatients);

// Get a specific patient by ID
router.get("/getPatientById/:id", patientController.getPatientById);

// Update a specific patient by ID
router.put("/updatePatient/:id", patientController.updatePatient);

// Delete a specific patient by ID
router.delete("/deletePatient/:id", patientController.deletePatient);

router.get('/getPatientByPatient_Id/:patient_ID', patientController.getPatientDetailsByPatient_ID);

router.get('/getAllPatientsByRoomID/:roomID', patientController.getAllPatientsByRoomID);

router.get('/getAllPatientsByInsId/:id', patientController.getAllPatientsByInsId);

router.get('/getAllPatientsByDiagnosis/:id/diagnosis', patientController.getAllPatientsByDiagnosis);

router.get('/searchPatientByPatient_ID/:patient_ID', patientController.searchPatientByPatient_ID);

router.get('/getAllPatientIds', patientController.getPatientIds);

router.get('/getAllPhoneNumbersByInstId/:id', patientController.getAllPhoneNumbersByInstId);

module.exports = router;


