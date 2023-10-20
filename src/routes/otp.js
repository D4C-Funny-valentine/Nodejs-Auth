const router = require("express").Router();
const optController = require("../controllers/otpController");

router.post("/", optController.sendOtp);
router.post("/verify", optController.verifyOtp);

module.exports = router;