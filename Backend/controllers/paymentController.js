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
        notify_url: `https://8c32-2405-204-522f-52b-d06a-350c-a164-3568.ngrok-free.app/api/cashfree-webhook`, ///update thi url everythime and update in cashfree and here

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

// exports.getPaymentStatus = async (orderId) => {
//   try {
//     for (let attempt = 0; attempt < 3; attempt++) {
//       const response = await Cashfree.PGOrderFetchPayments(
//         "2023-08-01",
//         orderId
//       );
//       console.log("Payment details:", response.data);
//       const payments = response.data;
//       if (payments.some((txn) => txn.payment_status === "SUCCESS"))
//         return "Success";
//       if (payments.some((txn) => txn.payment_status === "PENDING"))
//         await new Promise((r) => setTimeout(r, 5000));
//     }
//     return "Pending";
//   } catch (error) {
//     console.error("Error fetching payment status:", error.message);
//     throw error;
//   }
// };

exports.getPaymentStatus = async (orderId) => {
  const MAX_ATTEMPTS = 5; // Increased from 3 to 5
  const RETRY_DELAY_MS = 3000; // Reduced from 5s to 3s between checks
  const STATUS = {
    SUCCESS: "SUCCESS",
    PENDING: "PENDING",
    FAILED: "FAILED",
    TIMEOUT: "TIMEOUT",
    ERROR: "ERROR",
  };

  try {
    console.log(`[Payment Status] Checking status for order: ${orderId}`);

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      console.log(`Attempt ${attempt}/${MAX_ATTEMPTS}`);

      try {
        const response = await Cashfree.PGOrderFetchPayments(
          "2023-08-01",
          orderId
        );
        const payments = response.data;

        console.log(`Payment details for order ${orderId}:`, payments);

        // Check for explicit success/failure first
        if (payments.some((txn) => txn.payment_status === STATUS.SUCCESS)) {
          console.log(`Payment SUCCESS for order: ${orderId}`);
          return STATUS.SUCCESS;
        }

        if (payments.some((txn) => txn.payment_status === STATUS.FAILED)) {
          console.log(`Payment FAILED for order: ${orderId}`);
          return STATUS.FAILED;
        }

        // If still pending and not last attempt
        if (attempt < MAX_ATTEMPTS) {
          console.log(
            `Payment PENDING, retrying in ${RETRY_DELAY_MS / 1000}s...`
          );
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        }
      } catch (apiError) {
        console.error(`Attempt ${attempt} failed:`, apiError.message);
        // If it's the last attempt, rethrow the error
        if (attempt === MAX_ATTEMPTS) throw apiError;
      }
    }

    console.log(
      `Max attempts reached without final status for order: ${orderId}`
    );
    return STATUS.PENDING; // Or STATUS.TIMEOUT if you prefer
  } catch (error) {
    console.error(`Fatal error checking payment status for ${orderId}:`, error);
    // Distinguish between API errors and network/other errors
    if (error.response) {
      // Cashfree API error
      console.error("Cashfree API Error:", error.response.data);
      return STATUS.ERROR;
    } else {
      // Network or other errors
      console.error("System Error:", error.message);
      throw error; // Re-throw for the caller to handle
    }
  }
};
