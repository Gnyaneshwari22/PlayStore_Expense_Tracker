const Expenses = require("../models/Expenses");
const User = require("../models/User");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

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

    // Extract pagination parameters from the query string
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 3; // Default to 3 expenses per page if not provided
    const offset = (page - 1) * limit; // Calculate the offset for pagination

    // Fetch expenses for the authenticated user with pagination
    const expenses = await Expenses.findAll({
      where: { userId },
      limit: limit,
      offset: offset,
      order: [["created_at", "DESC"]], // Optional: Order expenses by creation date (newest first)
    });

    // Get the total count of expenses for the user (for pagination metadata)
    const totalExpenses = await Expenses.count({ where: { userId } });

    // Calculate total pages
    const totalPages = Math.ceil(totalExpenses / limit);

    // Send the response with expenses and pagination metadata
    res.status(200).json({
      expenses,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalExpenses: totalExpenses,
        limit: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete an expense (only if the user owns it)

const deleteExpense = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start a transaction
  try {
    const { id } = req.params; // Expense ID to delete
    const userId = req.user.id; // Get the authenticated user's ID

    // Find the expense by ID and ensure it belongs to the authenticated user
    const expense = await Expenses.findOne({
      where: { id, userId },
      transaction,
    });

    if (!expense) {
      await transaction.rollback(); // Rollback the transaction
      return res
        .status(404)
        .json({ message: "Expense not found or unauthorized" });
    }

    // Fetch the expense amount
    const expenseAmount = parseFloat(expense.amount);

    // Delete the expense
    await expense.destroy({ transaction });

    // Update the user's totalExpense by subtracting the deleted expense amount
    await User.decrement(
      "totalExpense",
      {
        by: expenseAmount,
        where: { id: userId },
      },
      { transaction } // Include the transaction
    );

    await transaction.commit(); // Commit the transaction
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction on error
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Downloading expenses

const downloadExpenses = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you store user id in the token

    // Fetch expenses for the user from the database
    const expenses = await Expenses.findAll({
      where: { userId },
      attributes: ["amount", "category", "description", "created_at"], // Select specific fields
    });

    // Convert expenses to CSV format
    const csv = convertExpensesToCSV(expenses);

    // Define the file path
    const filePath = path.join(__dirname, "../temp/expenses.csv");

    // Write the CSV data to a file
    fs.writeFileSync(filePath, csv);

    // Send the file to the client
    res.download(filePath, "expenses.csv", (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ message: "Failed to download file" });
      }

      // Delete the file after sending it to the client
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function convertExpensesToCSV(expenses) {
  const headers = "Amount,Category,Description,Date\n"; // CSV headers
  const rows = expenses
    .map((e) => `${e.amount},${e.category},${e.description},${e.created_at}`)
    .join("\n");
  return headers + rows;
}

module.exports = { addExpense, getExpenses, deleteExpense, downloadExpenses };
