const {
  emailVerifyAndSendOtp,
  verifyUserEmail,
} = require("../controllers/emailVerificationController");
const router = require("express").Router();

router.post("/email-verification", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email value is required" });
  }
  try {
    const createdEmailVerificationOTP = await emailVerifyAndSendOtp(email);
    return res.status(200).json(createdEmailVerificationOTP);
  } catch (error) {
    return res.status(500).json(error);
  }
});
router.post("/email-verification/verify", verifyUserEmail);

module.exports = router;