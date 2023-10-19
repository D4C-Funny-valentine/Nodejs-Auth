const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.SECRET_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to DB")
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;