const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database is connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

module.exports = connectDb;
