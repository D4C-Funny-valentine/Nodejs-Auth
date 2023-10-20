const Otp = require("../model/OTP");
const generateOtp = require("../utils/generateOtp");
const { hashData, verifyHashData } = require("../utils/hashData");
const sendEmail = require("../utils/sendEmail");
const { AUTH_EMAIL } = process.env;

const sendOtp = async (req, res) => {
  const { email, message, subject, duration = 1 } = req.body;
  if (!(email && message && subject)) {
    return res
      .status(400)
      .json({ error: "Email,message and subject are required" });
  }
  // clear the old data
  await Otp.deleteOne({ email });
  try {
    // generate pin
    const generatedOtp = await generateOtp();

    // send email
    const mailOptions = {
      from: AUTH_EMAIL,
      to: email,
      subject,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${subject}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            padding: 20px;
          }
          .container {
            background-color: #fff;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
          }
          p {
            color: #555;
            font-size: 16px;
          }
          .otp {
            color: tomato;
            font-size: 24px;
            letter-spacing: 2px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${subject}</h1>
          <p>${message}</p>
          <p>Your verification code is:</p>
          <p class="otp"><b>${generatedOtp}</b></p>
          <p>This code will expire in ${duration} hour(s).</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      </body>
      </html>
      `,
    };
    await sendEmail(mailOptions);

    // save the otp in db
    const hashedOtp = await hashData(generatedOtp);
    const createdOtp = await Otp.create({
      email,
      opt: hashedOtp,
      createdAt: Date.now(),
      expiredAt: Date.now() + 3600000 * +duration,
    });

    return res.status(201).json(createdOtp);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!(email && otp)) {
    return res.status(400).json({ error: "Provide values for email and otp" });
  }

  try {
    // ensure opt record exists
    const matchedOTPRecord = await Otp.findOne({ email });

    if (!matchedOTPRecord) {
      return res.status(404).json({ error: "No otp record found" });
    }

    const { expiredAt } = matchedOTPRecord;

    // check expire otp
    if (expiredAt < Date.now()) {
      await Otp.deleteOne({ email });
      return res.status(404).json({ error: "Otp record is expired." });
    } else {
      // if the otp is not expired
      const hashedOTP = matchedOTPRecord.opt;
      const validOTP = await verifyHashData(otp, hashedOTP);
      return res.status(200).json({ valid: validOTP });
    }
  } catch (error) {
    return res.status(404).json(error.message);
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
