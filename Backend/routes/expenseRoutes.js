const express = require("express");
const router = express.Router();

const {
  addExpense,
  getExpenses,
  deleteExpense,
} = require("../controllers/expenseControllers");

router.post("/expense/addExpense", addExpense);
router.get("/expense/getExpenses", getExpenses);
router.delete("/expense/deleteExpense/:id", deleteExpense);

module.exports = router;
