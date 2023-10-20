const signUpController = require("../controllers/signUpController");
const signInController = require("../controllers/signInController");
const verifyToken = require("../middleware/auth");
const router = require("express").Router();

router.post("/signup", signUpController.signUpHandler);
router.post("/signin", signInController.signInHandler);

router.get("/privacy",verifyToken,(req,res) => {
    res.json({"message": "You are enter the privacy"})
})

module.exports = router;