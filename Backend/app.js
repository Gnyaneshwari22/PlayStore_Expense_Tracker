const express = require("express");
const sequelize = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const cors = require("cors"); // Import the cors middleware

require("dotenv").config();

const app = express();

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// Use user routes
app.use("/", userRoutes);
app.use("/", expenseRoutes);

// Sync database and start server
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
