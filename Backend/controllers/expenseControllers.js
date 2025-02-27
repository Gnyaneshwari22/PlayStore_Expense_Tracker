const Expenses = require("../models/expense");

const addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const expense = await Expenses.create({ amount, description, category });
    console.log("Expense added:", expense);
    res.status(201).json(expense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(400).json({ error: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expenses.findAll();
    console.log("Fetched expenses:", expenses);
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(400).json({ error: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received DELETE request for ID:", id); // Debugging

    const deletedRows = await Expenses.destroy({ where: { id } });

    if (deletedRows === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    console.log("Expense deleted:", id);
    res.status(200).json({ message: "Expense deleted successfully" }); // ✅ Use 200 instead of 204
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addExpense, getExpenses, deleteExpense };
