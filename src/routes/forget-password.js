const router = require("express").Router();
const {
  sendPasswordResetOTPEmail,
  resetNewPassword,
} = require("../controllers/forgetPasswordController");
router.post("/forget-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  try {
    const createdResetOtpData = await sendPasswordResetOTPEmail(email);
    res.status(200).json(createdResetOtpData);
    return;
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/forget-password/reset", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!(email && otp && newPassword)) {
    res.status(400).json({ error: "Email , otp and newPassword are required" });
  }

  try {
    await resetNewPassword({ email, otp, newPassword });
    return res.status(201).json({ email, passwordReset: true });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
