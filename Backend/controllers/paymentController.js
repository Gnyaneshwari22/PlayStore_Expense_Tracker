const { Cashfree } = require("cashfree-pg");
const Order = require("../models/Order");
require("dotenv").config();

// Set up Cashfree credentials
Cashfree.XClientId = process.env.CASHFREE_API_ID;
Cashfree.XClientSecret = process.env.CASHFREE_API_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

exports.createOrder = async (
  orderId,
  orderAmount,
  orderCurrency,
  customerID,
  customerPhone
) => {
  try {
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const request = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: orderId,
      customer_details: {
        customer_id: customerID,
        customer_phone: customerPhone,
        customer_email: "test@example.com",
      },
      order_meta: {
        return_url: `http://127.0.0.1:5500/FrontEnd/cashFreePayment/payment-status.html?order_id=${orderId}`,
        notify_url: `https://a0db-2409-4071-2100-d8db-94a0-b25-ef10-edd1.ngrok-free.app/api/cashfree-webhook`, ///update thi url everythime and update in cashfree and here

        payment_methods: "cc,dc,upi,nb",
      },
      order_expiry_time: expiryDate,
    };

    console.log("Request Object:", request);
    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    console.log("Cashfree API Response:", response.data);
    return response.data.payment_session_id;
  } catch (error) {
    console.error("Error creating order:", error.message);
    throw error;
  }
};

exports.getPaymentStatus = async (orderId) => {
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await Cashfree.PGOrderFetchPayments(
        "2023-08-01",
        orderId
      );
      console.log("Payment details:", response.data);
      const payments = response.data;
      if (payments.some((txn) => txn.payment_status === "SUCCESS"))
        return "Success";
      if (payments.some((txn) => txn.payment_status === "PENDING"))
        await new Promise((r) => setTimeout(r, 5000));
    }
    return "Pending";
  } catch (error) {
    console.error("Error fetching payment status:", error.message);
    throw error;
  }
};
