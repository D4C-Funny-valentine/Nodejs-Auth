const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// make a structure for the user
const UserSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accessToken: String,
});

const User = mongoose.model("User", UserSchema); // create a User model in db
module.exports = User;
