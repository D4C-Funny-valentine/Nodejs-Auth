const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OtpSchema = new Schema({
  email: { type: String, required: true, unique: true },
  opt: String,
  createdAt: Date,
  expiredAt: Date,
});

const Otp = mongoose.model("OtpCode", OtpSchema);
module.exports = Otp;
