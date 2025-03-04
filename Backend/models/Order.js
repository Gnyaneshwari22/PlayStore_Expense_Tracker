// models/Order.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");

const Order = sequelize.define(
  "Order",
  {
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    orderAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    orderCurrency: {
      type: DataTypes.STRING,
      defaultValue: "INR",
    },
    customerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
      defaultValue: "PENDING",
    },
    paymentSessionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER, // Assuming userId is an integer
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

module.exports = Order;
