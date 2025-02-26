const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/userControllers");

router.post("/user/signup", signup);
router.post("/user/login", login);

module.exports = router;
