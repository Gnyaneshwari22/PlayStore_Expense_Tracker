const express = require("express");
const router = express.Router();
const {
  getTotalExpensesByUser,
} = require("../controllers/showLeaderBoardController");

router.get("/showleaderboard", getTotalExpensesByUser);
module.exports = router;
