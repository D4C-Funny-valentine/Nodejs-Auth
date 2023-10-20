const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyHashData } = require("../utils/hashData");
const createToken = require("../utils/createToken");

const signInHandler = async (req, res) => {
  const { email, password } = req.body;
  // Trim white spaces from input strings
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  //  Check if any of the input fields are missing
  if (!(trimmedEmail && trimmedPassword)) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: trimmedEmail }).exec();
    if (!user) {
      return res.status(404).json({
        error:
          "Invalid email or password. Please check your credentials and try again.",
      });
    }

    const isPasswordMatch = await verifyHashData(password, user.password);
    if (isPasswordMatch) {
      const accessToken = createToken({
        userId: user._id,
        email: user.email,
      });
      user.accessToken = accessToken;
      const result = await user.save();
      const { password, __v,...data } = result._doc
      return res.status(200).json({success: true, data});
    } else {
      return res.status(401).json({ error: "Incorrect password" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { signInHandler };
