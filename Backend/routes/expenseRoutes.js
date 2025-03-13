const express = require("express");
const router = express.Router();

const {
  addExpense,
  getExpenses,
  deleteExpense,
  downloadExpenses,
} = require("../controllers/expenseControllers");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/addExpense", authMiddleware, addExpense);
router.get("/getExpenses", authMiddleware, getExpenses);
router.delete("/deleteExpense/:id", authMiddleware, deleteExpense);
router.get("/download", authMiddleware, downloadExpenses);

module.exports = router;
