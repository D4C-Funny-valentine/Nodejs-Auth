// Name RegEx - !/^[a-zA-Z ]*$/.test(name)
// Email RegEx - !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
const User = require("../model/User");
const { hashData } = require("../utils/hashData");

const signUpHandler = async (req, res) => {
  const { name, email, password } = req.body;
  // Trim white spaces from input strings

  const trimmedName = name && name.trim();
  const trimmedEmail = email && email.trim();
  const trimmedPassword = password && password.trim();

  //  Check if any of the input fields are missing
  if (!trimmedName || !trimmedEmail || !trimmedPassword) {
    return res
      .status(400)
      .json({ error: "Name, email and password are required" });
  }

  // Check if the name contains only letters and spaces
  if (!/^[a-zA-Z ]*$/.test(trimmedName)) {
    return res.status(400).json({ error: "Invalid name" });
  }

  // Check if the email is in a valid format
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(trimmedEmail)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  // Check if the password is too short
  if (trimmedPassword.length < 7) {
    return res
      .status(400)
      .json({ error: "Password must contain at least 8 characters" });
  }

  try {
    const hashPassword = await hashData(trimmedPassword, 10);
    await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashPassword,
    });
    return res.status(200).json({
      success: true,
      message: `${trimmedName} is signed up successfully`,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { signUpHandler };
