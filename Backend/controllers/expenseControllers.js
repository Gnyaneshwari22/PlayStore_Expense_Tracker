const Expenses = require("../models/Expenses");
const User = require("../models/User");
// const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
//const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const AWS = require("aws-sdk");
const convertExpensesToCSV = require("../utils/convertExpensesToCSV"); // make sure this is correct
require("dotenv").config();

// Add a new expense

const addExpense = async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction

  try {
    const { amount, description, category } = req.body;
    const userId = req.user.id;

    // Create a new expense within the transaction
    const expense = await Expenses.create(
      { amount, description, category, userId },
      { transaction: t }
    );

    // Update the user's totalExpense within the transaction
    await User.increment("totalExpense", {
      by: amount,
      where: { id: userId },
      transaction: t,
    });

    await t.commit(); // Explicitly commit the transaction if everything succeeds
    res.status(201).json(expense);
  } catch (error) {
    await t.rollback(); //  Rollback the transaction if an error occurs
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

// const downloadExpenses = async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming you store user id in the token

//     // Fetch expenses for the user from the database
//     const expenses = await Expenses.findAll({
//       where: { userId },
//       attributes: ["amount", "category", "description", "created_at"], // Select specific fields
//     });

//     // Convert expenses to CSV format
//     const csv = convertExpensesToCSV(expenses);

//     // Define the file path
//     const filePath = path.join(__dirname, "../temp/expenses.csv");

//     // Write the CSV data to a file
//     fs.writeFileSync(filePath, csv);

//     // Send the file to the client
//     res.download(filePath, "expenses.csv", (err) => {
//       if (err) {
//         console.error("Error sending file:", err);
//         res.status(500).json({ message: "Failed to download file" });
//       }

//       // Delete the file after sending it to the client
//       fs.unlinkSync(filePath);
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// AWS config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const downloadExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch all expenses for the user
    const expenses = await Expenses.findAll({
      where: { userId },
      attributes: ["amount", "category", "description", "created_at"],
    });

    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: "No expenses found for user" });
    }

    // 2. Convert to CSV format using your function
    const csv = convertExpensesToCSV(expenses);

    // 3. Upload to S3
    const fileName = `expenses_${userId}_${Date.now()}.csv`;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Body: csv,
      // ACL: "public-read", // makes the file publicly accessible
      ContentType: "text/csv",
    };

    const data = await s3.upload(params).promise();

    // 4. Send the file URL to the frontend
    return res.status(200).json({
      message: "Expenses file uploaded successfully",
      fileUrl: data.Location,
    });
  } catch (error) {
    console.error("Error downloading expenses:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { addExpense, getExpenses, deleteExpense, downloadExpenses };
