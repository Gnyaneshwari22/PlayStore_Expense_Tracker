const Expenses = require("../models/Expenses");
const User = require("../models/User");

const sequelize = require("sequelize");

const getTotalExpensesByUser = async (req, res) => {
  try {
    // Fetch users with their totalExpense, sorted in descending order
    const users = await User.findAll({
      attributes: ["id", "username", "totalExpense"],
      order: [["totalExpense", "DESC"]], // Sort by totalExpense in descending order
      raw: true, // Return raw data
    });

    // Format the response
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      totalExpense: user.totalExpense,
    }));

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getTotalExpensesByUser };
