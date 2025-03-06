const User = require("./User");
const Expenses = require("./Expenses");
const ForgotPasswordRequest = require("./ForgotPasswordRequest");

// One-to-Many: User has many Expenses
User.hasMany(Expenses, { foreignKey: "userId" });
Expenses.belongsTo(User, { foreignKey: "userId" });

// Define the relationship
User.hasMany(ForgotPasswordRequest, { foreignKey: "userId" });
ForgotPasswordRequest.belongsTo(User, { foreignKey: "userId" });
