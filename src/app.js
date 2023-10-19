require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOption = require("./config/corsOption");
const connectDB = require("./config/connectDB");

connectDB();

app.use(cors(corsOption));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

module.exports = app