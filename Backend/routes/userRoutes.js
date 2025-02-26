const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/userControllers");

router.post("/user/signup", signup);

module.exports = router;
