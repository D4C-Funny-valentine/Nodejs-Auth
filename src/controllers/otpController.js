const Otp = require("../model/OTP");
const generateOtp = require("../utils/generateOtp");
const { hashData, verifyHashData } = require("../utils/hashData");
const sendEmail = require("../utils/sendEmail");
const createMailOptions = require("../components/mailOptions");

const sendOtp = async ({ email, subject, message, duration }) => {
  if (!(email && message && subject)) {
    throw Error("Email, subject and message are required");
  }

  await Otp.deleteOne({ email });
  try {
    // generate pin
    const generatedOtp = await generateOtp();

    // send email
    const mailOptions = createMailOptions(
      email,
      subject,
      message,
      generatedOtp,
      duration
    );

    await sendEmail(mailOptions);

    // save the otp in db
    const hashedOtp = await hashData(generatedOtp);
    const createdOtpRecord = await Otp.create({
      email: email,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiredAt: Date.now() + 3600000 * +duration,
    });

    return createdOtpRecord;
  } catch (error) {
    throw error;
  }
};

const verifyOtp = async ({ email, otp }) => {
  try {
    if (!(email && otp)) {
      throw Error("Provide values for email and otp");
    }
    // ensure opt record exists
    const matchedOTPRecord = await Otp.findOne({ email });

    if (!matchedOTPRecord) {
      throw Error("No otp record found");
    }

    const { expiredAt } = matchedOTPRecord;

    // check expire otp
    if (expiredAt < Date.now()) {
      await Otp.deleteOne({ email });
      throw Error("Otp record is expired.");
    } else {
      // if the otp is not expired
      const hashedOTP = matchedOTPRecord.otp;
      const validOTP = await verifyHashData(otp, hashedOTP);
      return validOTP;
    }
  } catch (error) {
    throw error;
  }
};

const deleteOtp = async (email) => {
  try {
    await Otp.deleteOne({ email });
  } catch (error) {
    throw error;
  }
};

module.exports = { sendOtp, verifyOtp, deleteOtp };