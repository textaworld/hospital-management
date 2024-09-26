const express = require('express');
const router = express.Router();

const cardController = require('../controllers/CardController');

// Create a new card
router.post("/createCard", cardController.createCard);

// Get all cards
router.get("/getAllCards", cardController.getAllCards);

// Get a specific card by ID
router.get("/getCardById/:id", cardController.getCardById);

router.get("/getCardByPatientId/:id", cardController.getCardByPatientId);


// Update a specific card by ID
router.put("/updateCard/:id", cardController.updateCard);

// Delete a specific card by ID
router.delete("/deleteCard/:id", cardController.deleteCard);

// Get all cards by hospital ID
router.get('/getAllCardsByHospitalId/:id', cardController.getAllCardsByHospitalId);

// Get all cards by patient ID
router.get('/getAllCardsByPatientId/:id', cardController.getAllCardsByPatientId);

module.exports = router;
