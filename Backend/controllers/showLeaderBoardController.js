const Expenses = require("../models/Expenses");
const User = require("../models/User");

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

const CheckPremiumStatus = async (req, res) => {
  try {
    console.log("req.user in CheckPremiumStatus:", req.user); // Debugging log
    const userId = req.user.id; // Get the authenticated user's ID

    const user = await User.findOne({ where: { id: userId } });
    //console.log("User found in database:", user); // Debugging log

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // console.log("User premiumMember value:", user.premiumMember); // Debugging log
    res.status(200).json({ isPremium: user.premiumMember === true }); // Return premium status
  } catch (error) {
    console.error("Error fetching premium status:", error);
    res.status(500).json({ error: "Error fetching premium status" });
  }
};

module.exports = { getTotalExpensesByUser, CheckPremiumStatus };
