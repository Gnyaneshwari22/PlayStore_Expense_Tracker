const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createOrder,
  getPaymentStatus,
} = require("../controllers/paymentController");

router.post("/pay", authMiddleware, async (req, res) => {
  try {
    const { orderAmount, customerID, customerPhone } = req.body;
    const userId = req.userId; // Extract userId from the token
    console.log("userID is ----------> ", userId);
    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      "INR",
      customerID,
      customerPhone
    );

    await Order.create({
      orderId,
      orderAmount,
      customerId: customerID,
      customerPhone,
      paymentSessionId,
      status: "PENDING",
      userId: userId,
    });

    res.json({ paymentSessionId });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.get("/payment-status/:orderId?", async (req, res) => {
  try {
    // Support both query params & route params
    const orderId = req.params.orderId || req.query.order_id;

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID is required" });
    }

    const paymentStatus = await getPaymentStatus(orderId);
    res.status(200).json({ success: true, orderId, paymentStatus });
  } catch (error) {
    console.error("Error fetching payment status:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/cashfree-webhook", async (req, res) => {
  try {
    console.log("Received Webhook Data:---------->", req); // Log incoming data

    const order_id = req.body.data.order.order_id; // Access order_id
    const payment_status = req.body.data.payment.payment_status; // Access payment_status
    console.log(
      "order id and payment status ******************>>",
      order_id,
      payment_status
    );
    await Order.update(
      { status: payment_status },
      { where: { orderId: order_id } }
    );
    // If payment is successful, update the user's premium status
    if (payment_status === "SUCCESS") {
      const order = await Order.findOne({ where: { orderId: order_id } });

      if (order) {
        await User.update(
          { premiumMember: 1 }, // Update the user to premium
          { where: { id: order.userId } }
        );
        console.log("User upgraded to premium:", order.userId);
      }
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in webhook:", error.message);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
