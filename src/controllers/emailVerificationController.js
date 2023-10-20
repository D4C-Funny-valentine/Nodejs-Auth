const User = require("../model/User");
const { sendOtp, verifyOtp, deleteOtp } = require("./otpController");

const emailVerifyAndSendOtp = async (email) => {
  try {
    // check the user is existed
    const existedUser = await User.findOne({ email }).exec();

    if (!existedUser) {
      throw new Error("Unauthorized");
    }

    const otpDetails = {
      email: email,
      subject: "Email verification",
      message: "Verify your email with the code below",
      duration: 1,
    };

    const createdOtp = await sendOtp(otpDetails);
    console.log(createdOtp);
    return createdOtp;
  } catch (error) {
    throw error;
  }
};

const verifyUserEmail = async (req, res) => {
  let { email, otp } = req.body;
  if (!(email && otp)) {
    return res.status(400).json({ error: "Email and opt code are required" });
  }
  try {
    const verifyOTP = await verifyOtp({ email, otp });
    if (!verifyOTP) {
      return res
        .status(401)
        .json({ error: "Invalid email or otp code. Check your inbox again" });
    }

    await User.updateOne({ email }, { verified: true });
    await deleteOtp(email);
    return res.status(200).json({ email, valid: true });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = { emailVerifyAndSendOtp, verifyUserEmail };