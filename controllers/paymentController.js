const PaymentModel = require("../models/paymentModel");

const createPayment = (req, res) => {
  const {
    inst_ID,
doctor_ID,
patient_ID,
    amount,
    channel_ID,
    date,
    month,
    status
  } = req.body;

  const newPayment = new PaymentModel({
    inst_ID,
doctor_ID,
patient_ID,
channel_ID,
    amount,
    date,
    month,
    status
  });

  newPayment
    .save()
    .then((payment) => res.json(payment))
    .catch((err) => res.json({ error: err.message }));
};

const getAllPayments = (req, res) => {
  PaymentModel.find()
    .then((payment) => res.json(payment))
    .catch((err) => res.json({ error: err.message }));
};

const getPaymentStatus = async (req, res) => {
  const { std_ID, classID, month } = req.query;

  try {
    // Assuming your PaymentModel has a field for class name, adjust the query accordingly
    const payment = await PaymentModel.findOne({ std_ID, classID, month });

    if (!payment) {
      return res.status(404).json({ status: "not found" });
    }

    return res.json({ status: payment.status });
  } catch (error) {
    
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllPaymentsByInsId = async (req, res) => {
  const { id } = req.params;

  try {
    const payments = await PaymentModel.find({ inst_ID: id }).sort({
      createdAt: -1,
    });

    if (!payments || payments.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No payments found", data: null });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "payments fetched successfully",
        data: payments,
      });
  } catch (error) {
    

    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

;


// Route to get last month's payment status for a student
const getAllPaymentStatusBystdId = async (req, res) => {
  try {
    const { std_ID } = req.params;

    // Check if std_ID is an array or a single value
    const stdIDs = Array.isArray(std_ID) ? std_ID : [std_ID];

    // Create an array to store response for each std_ID
    const responses = [];

    // Iterate through each std_ID and fetch payment status
    for (const id of stdIDs) {
      // Get the current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // Month is zero-based (0 = January, 1 = February, etc.)
      const currentYear = currentDate.getFullYear();

      // Calculate the previous month's index
      const previousMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;

      // Get the name of the previous month
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const previousMonthName = months[previousMonthIndex];

      // Find the payment record for the previous month
      const previousMonthPayment = await PaymentModel.findOne({ std_ID: id, month: previousMonthName });

      if (!previousMonthPayment) {
        responses.push(previousMonthStatus);
      } else {
        const previousMonthStatus = previousMonthPayment.status;
        responses.push(previousMonthStatus);
      }
    }

    // Send all responses
    res.json(responses);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


;


//goooooood
const calculateMonthlyIncome = async (req, res) => {
  const { doctor_ID, month } = req.query;


console.log(doctor_ID,month)

  try {
    const payments = await PaymentModel.find({ doctor_ID , month});

    console.log("doctor payments",payments)
 
    let totalIncome = 0;
    payments.forEach(payment => {
        totalIncome += payment.amount;
    });
   // console.log(totalIncome)
    res.json({ doctor_ID, month, totalIncome });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate monthly income" });
  }
}; 

const calculateDailyIncome = async (req, res) => {
  const { doctor_ID  } = req.query;
  console.log("cal doc",doctor_ID)  

  // Get today's date
  const today = new Date();
  // Set hours, minutes, seconds, and milliseconds to 0 to compare dates only
  today.setHours(0, 0, 0, 0);

  try {
    // Find payments for the specified classID and today's date
    const payments = await PaymentModel.find({ doctor_ID, date: { $gte: today } });

    // console.log("daily income") 
    // console.log("daily income",payments)

    let totalIncome = 0;
    // Calculate total income for today
    payments.forEach(payment => {
        totalIncome += payment.amount;
    });

    res.json({ classID, date: today, totalIncome });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate daily income" });
  }
};

const calculateMonthlyIncomeByInstID = async (req, res) => {
  const { inst_ID, month } = req.query;


console.log("cal inst",inst_ID,month)

  try {
    const payments = await PaymentModel.find({ inst_ID,month });

    console.log("payments",payments)

    let totalIncome = 0;
    payments.forEach(payment => {
        totalIncome += payment.amount;
    });
    console.log(totalIncome)
    res.json({ inst_ID, month, totalIncome });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate monthly income" });
  }
};



const calculateDateIncomeByInstID = async (req, res) => {
  const { inst_ID, date } = req.query;
  console.log("inst daily",inst_ID,date)

  try {
    // Construct a range for the entire day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0); // Set to 00:00:00
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999); // Set to 23:59:59

    // Find payments within the date range
    const payments = await PaymentModel.find({
      inst_ID,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    console.log("daily payments",payments)

    let totalIncome = 0;
    payments.forEach(payment => {
      totalIncome += payment.amount;
    });

    res.json({ inst_ID, date, totalIncome });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate daily income" });
  }
};

const calculateIncomeByDate = async (req, res) => {
  const { doctor_ID, date } = req.query;

  try {
    // Construct a range for the entire day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0); // Set to 00:00:00
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999); // Set to 23:59:59

    // Find payments within the date range
    const payments = await PaymentModel.find({
      doctor_ID,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    console.log(payments)

    let totalIncome = 0;
    payments.forEach(payment => {
      totalIncome += payment.amount;
    });

    res.json({ doctor_ID, date, totalIncome });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate daily income" });
  }
};
;

const deletePayment = (req, res) => {
  const id = req.params.id; // Use 'id' instead of '_id' here
  console.log("id", id);
  
  PaymentModel.findByIdAndDelete(id)
    .then((deletedPayment) => {
      if (!deletedPayment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json({ message: "Payment deleted successfully" });
    })
    .catch((err) => {
      console.error("Error deleting payment:", err);
      res.status(500).json({ error: "Failed to delete payment" });
    });
};

const getAllPaymentsByPatientID = async (req, res) => {
  const  patient_ID  = req.params.id;
  console.log("payments patient_ID", patient_ID);
  try {
    const payments = await PaymentModel.find({ patient_ID }).sort({ date: -1 });
    console.log("payments",payments)

    if (!payments || payments.length === 0) {
      return res.status(404).json({ success: false, message: "No payments found for this patient", data: null });
    }

    res.status(200).json({
      success: true,
      message: "Payments fetched successfully",
      data: payments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentStatus,
  getAllPaymentsByInsId,
  getAllPaymentStatusBystdId,
  calculateMonthlyIncome,
  calculateDailyIncome,
  calculateMonthlyIncomeByInstID,
  calculateDateIncomeByInstID,
  calculateIncomeByDate,
  deletePayment,
  getAllPaymentsByPatientID
};





