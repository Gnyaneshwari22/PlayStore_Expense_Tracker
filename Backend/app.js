const express = require("express");
const sequelize = require("./config/db");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const premiumRoutes = require("./routes/premiumUserRoute");
const passwordResetRoutes = require("./routes/passwordResetRoutes");
require("dotenv").config();

const app = express();

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../FrontEnd/cashFreePayment"))); //check this one..
app.use("/FrontEnd", express.static(path.join(__dirname, "../FrontEnd")));

// Use user routes
app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/api", paymentRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", passwordResetRoutes);

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
