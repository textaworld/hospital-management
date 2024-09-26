const CardModel = require("../models/CardModel");

// Create a new card
const createCard = async (req, res) => {
  try {
    const { inst_ID, patient_ID, status, date } = req.body;

    const newCard = new CardModel({
      inst_ID,
      patient_ID,
      status,
      date,
    });

    const savedCard = await newCard.save();
    res.json(savedCard);
  } catch (err) {
    console.error("Error saving card:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all cards
const getAllCards = (req, res) => {
  CardModel.find()
    .then((cards) => res.json(cards))
    .catch((err) => res.json({ error: err.message }));
};

// Get a card by ID
const getCardById = (req, res) => {
  const card_ID = req.params.id;

  CardModel.findById(card_ID)
    .then((card) => {
      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }
      res.json(card);
    })
    .catch((err) => res.json({ error: err.message }));
};

const getCardByPatientId = (req, res) => {
    const patient_ID = req.params.id;
    console.log("card patient_ID", patient_ID);
  
    CardModel.findOne({ patient_ID })  // Use findOne or find to query by patient_ID
      .then((card) => {
        if (!card) {
          return res.status(404).json({ error: "Card not found" });
        }
        res.json(card);
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  };
  
// Update a card by ID
const updateCard = (req, res) => {
  const cardID = req.params.id;
  const { inst_ID, patient_ID, status, date } = req.body;

  CardModel.findByIdAndUpdate(
    cardID,
    {
      inst_ID,
      patient_ID,
      status,
      date,
    },
    { new: true }
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        return res.status(404).json({ error: "Card not found" });
      }
      res.json(updatedCard);
    })
    .catch((err) => res.json({ error: err.message }));
};

// Delete a card by ID
const deleteCard = (req, res) => {
  const card_ID = req.params.id;

  CardModel.findByIdAndDelete(card_ID)
    .then((deletedCard) => {
      if (!deletedCard) {
        return res.status(404).json({ error: "Card not found" });
      }
      res.json({ message: "Card deleted successfully" });
    })
    .catch((err) => res.json({ error: err.message }));
};

// Get all cards by hospital ID
const getAllCardsByHospitalId = async (req, res) => {
  const { id } = req.params;
  try {
    const cards = await CardModel.find({ inst_ID: id }).sort({ createdAt: -1 });

    if (!cards || cards.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No cards found", data: null });
    }

    res.status(200).json({
      success: true,
      message: "Cards fetched successfully",
      data: cards,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Get all cards by patient ID
const getAllCardsByPatientId = async (req, res) => {
  const { id } = req.params;
  try {
    const cards = await CardModel.find({ patient_ID: id }).sort({ createdAt: -1 });

    if (!cards || cards.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No cards found for this patient", data: null });
    }

    res.status(200).json({
      success: true,
      message: "Cards fetched successfully",
      data: cards,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  createCard,
  getAllCards,
  getCardById,
  updateCard,
  deleteCard,
  getAllCardsByHospitalId,
  getCardByPatientId,
  getAllCardsByPatientId,
};
