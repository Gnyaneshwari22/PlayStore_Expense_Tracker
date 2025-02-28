const User = require("./User");
const Expenses = require("./Expenses");

// One-to-Many: User has many Expenses
User.hasMany(Expenses, { foreignKey: "userId" });
Expenses.belongsTo(User, { foreignKey: "userId" });
