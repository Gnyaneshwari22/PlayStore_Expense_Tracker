const Expenses = require("../models/Expenses");
const User = require("../models/User");

const sequelize = require("sequelize");

const getTotalExpensesByUser = async (req, res) => {
  try {
    // Query to get total expenses by user along with username
    const result = await Expenses.findAll({
      attributes: [
        "userId",
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"], // Aggregate the total amount
      ],
      include: [
        {
          model: User,
          attributes: ["username"], // Include the username from the User table
          required: true, // Ensure only users with expenses are included
        },
      ],
      group: ["userId"], // Group by userId to get totals per user
      order: [[sequelize.literal("totalAmount"), "DESC"]], // Sort by totalAmount in descending order
      raw: true, // Return raw data instead of Sequelize instances
    });

    // Format the result to match the desired output
    const formattedResult = result.map((item) => ({
      userId: item.userId,
      username: item["User.username"], // Access the username from the joined table
      totalAmount: parseFloat(item.totalAmount) || 0, // Ensure totalAmount is a number
    }));

    // Send the response
    res.status(200).json(formattedResult);
  } catch (error) {
    console.error("Error fetching total expenses by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getTotalExpensesByUser };
