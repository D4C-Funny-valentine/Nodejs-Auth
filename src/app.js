require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOption = require("./config/corsOption");
const connectDB = require("./config/connectDB");

connectDB(); // connect the Database

app.use(cors(corsOption)); // middleware for Cross-origin Resource Sharing

app.use(express.urlencoded({ extended: false })); // middleware for urlencoded

app.use(express.json()); // middleware for parser json

// route
app.use("/api/v1/user", require("./routes/auth"));
app.use("/api/v1/otp", require("./routes/otp"));

// app.use("", (req,res) => {
// })

module.exports = app;
