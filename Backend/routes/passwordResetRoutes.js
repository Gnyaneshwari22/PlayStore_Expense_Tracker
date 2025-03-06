// const express = require("express");
// const router = express.Router();
// const { forgotPassword } = require("../controllers/passwordResetController");

// router.post("/forgotpassword", forgotPassword);

// module.exports = router;
const express = require("express");
const router = express.Router();
const {
  forgotPassword,
  resetPasswordForm,
  updatePassword,
} = require("../controllers/passwordResetController");

router.post("/forgotpassword", forgotPassword);
router.get("/resetpassword/:requestId", resetPasswordForm);
router.post("/updatepassword", updatePassword);

module.exports = router;
