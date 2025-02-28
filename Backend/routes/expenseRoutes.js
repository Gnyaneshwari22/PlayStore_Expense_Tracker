const express = require("express");
const router = express.Router();

const {
  addExpense,
  getExpenses,
  deleteExpense,
} = require("../controllers/expenseControllers");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/expense/addExpense", authMiddleware, addExpense);
router.get("/expense/getExpenses", authMiddleware, getExpenses);
router.delete("/expense/deleteExpense/:id", authMiddleware, deleteExpense);

module.exports = router;
