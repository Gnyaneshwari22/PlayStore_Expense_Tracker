// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Create an order
router.post("/createOrder", orderController.createOrder);

// Handle payment webhook
router.post("/webhook", orderController.handleWebhook);

module.exports = router;
