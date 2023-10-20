const User = require("../model/User");
const { hashData } = require("../utils/hashData");
const { sendOtp, verifyOtp, deleteOtp } = require("./otpController");

const sendPasswordResetOTPEmail = async (email) => {
  const findUser = await User.findOne({ email }).exec();
  if (!findUser) {
    throw Error("There is no account for the provided email");
  }

  try {
    if (!findUser.verified) {
      throw Error("Email hasn't verify yet. Check your inbox.");
    }

    const optDetails = {
      email,
      subject: "Forget Password",
      message: "Please enter the code below to reset your password",
      duration: 1,
    };

    const createdOTP = await sendOtp(optDetails);
    return createdOTP;
  } catch (error) {
    throw error;
  }
};

const resetNewPassword = async ({ email, otp, newPassword }) => {
  //  verify the otp
  try {
    const verifyOTP = await verifyOtp({ email, otp });

    if (!verifyOTP) {
      throw Error("Invalid code passed. Check your inbox.");
    }

    if (newPassword.length < 7) {
      throw Error("Password is too short");
    }
    // create new password
    const hashNewPassword = await hashData(newPassword);
    await User.updateOne({ email }, { password: hashNewPassword });
    // delete the old otp data
    await deleteOtp(email);
    return;
  } catch (error) {
    throw error;
  }
};

module.exports = { sendPasswordResetOTPEmail, resetNewPassword };
