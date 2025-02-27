const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");

const Expenses = sequelize.define(
  "Expenses",
  {
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: true, // Ensures Sequelize manages createdAt and updatedAt.
    createdAt: "created_at", // Maps Sequelize's createdAt to created_at
    updatedAt: "updated_at",
  }
);

module.exports = Expenses;
