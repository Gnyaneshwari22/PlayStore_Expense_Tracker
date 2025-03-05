const express = require("express");
const sequelize = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const User = require("./models/User");
const Order = require("./models/Order");
const Expenses = require("./models/Expenses");
const paymentRoutes = require("./routes/paymentRoutes");
const cors = require("cors");
const path = require("path");
const premiumRoutes = require("./routes/premiumUserRoute");

require("dotenv").config();

const app = express();

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../FrontEnd/cashFreePayment")));

User.hasMany(Expenses, { foreignKey: "userId" });
Expenses.belongsTo(User, { foreignKey: "userId" });

// Use user routes
app.use("/", userRoutes);
app.use("/", expenseRoutes);
app.use("/api", paymentRoutes);
app.use("/premium", premiumRoutes);

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
