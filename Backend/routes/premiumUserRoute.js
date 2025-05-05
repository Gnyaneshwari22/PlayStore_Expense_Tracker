const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  getTotalExpensesByUser,
  CheckPremiumStatus,
} = require("../controllers/showLeaderBoardController");

router.get("/showleaderboard", authMiddleware, getTotalExpensesByUser);
router.get("/user/premiumStatus", authMiddleware, CheckPremiumStatus);
module.exports = router;
