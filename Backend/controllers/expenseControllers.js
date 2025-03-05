const Expenses = require("../models/Expenses");
const User = require("../models/User");

// Add a new expense
const addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const userId = req.user.id; // Get the authenticated user's ID

    // Create a new expense associated with the user
    const expense = await Expenses.create({
      amount,
      description,
      category,
      userId, // Associate the expense with the user
    });
    // Update the user's totalExpense
    await User.increment("totalExpense", {
      by: amount,
      where: { id: userId },
    });

    //console.log("Expense added:", expense);  //debugging console
    res.status(201).json(expense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all expenses for the authenticated user
const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID

    // Fetch expenses only for the authenticated user
    const expenses = await Expenses.findAll({ where: { userId } });

    //console.log("Fetched expenses:", expenses); //debugging
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete an expense (only if the user owns it)
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params; // Expense ID to delete
    const userId = req.user.id; // Get the authenticated user's ID

    console.log("Received DELETE request for ID:", id); // Debugging

    // Find the expense by ID and ensure it belongs to the authenticated user
    const expense = await Expenses.findOne({ where: { id, userId } });

    if (!expense) {
      return res
        .status(404)
        .json({ message: "Expense not found or unauthorized" });
    }

    // Delete the expense
    await expense.destroy();

    console.log("Expense deleted:", id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addExpense, getExpenses, deleteExpense };
