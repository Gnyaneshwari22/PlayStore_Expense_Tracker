const express = require("express");
const sequelize = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const User = require("./models/User");
const Expenses = require("./models/Expenses");
const orderRoutes = require("./routes/orderRoutes");
const cors = require("cors");

require("dotenv").config();

const app = express();

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

User.hasMany(Expenses, { foreignKey: "userId" });
Expenses.belongsTo(User, { foreignKey: "userId" });

// Use user routes
app.use("/", userRoutes);
app.use("/", expenseRoutes);
app.use("/api/payment", orderRoutes);

// Sync database and start server
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced");
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
