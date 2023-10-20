const router = require("express").Router();
const { sendOtp, verifyOtp } = require("../controllers/otpController");
const Otp = require("../model/OTP");

router.post("/", async (req, res) => {
  try {
    const { email, subject, message, duration } = req.body;

    const createdOtp = await sendOtp({
      email,
      subject,
      message,
      duration,
    });
    return res.status(200).json(createdOtp);
  } catch (error) {
    return res.status(500).json(error);
  }
});
router.post("/verify", async (req, res) => {
  try {
    let { email, otp } = req.body;
    const validOTP = await verifyOtp({ email, otp });
    return res.status(200).json({ valid: validOTP });
  } catch (error) {
    return res.status(401).json(error);
  }
});

module.exports = router;
