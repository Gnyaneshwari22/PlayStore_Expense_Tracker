// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded. Initializing Cashfree...");

  // Initialize Cashfree
  const cashfree = Cashfree({
    mode: "sandbox",
  });

  const payButton = document.getElementById("payButton");

  payButton.addEventListener("click", async () => {
    const orderAmount = "100.00"; // Example amount
    const customerId = "CUST_12345"; // Example customer ID
    const customerPhone = "9876543210"; // Example phone number

    try {
      console.log("Creating order..."); // Debugging: Log start of order creation
      const response = await axios.post(
        "http://localhost:3000/api/payment/createOrder",
        {
          orderAmount,
          customerId,
          customerPhone,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Order creation response:", response.data); // Debugging: Log response data

      const { paymentSessionId } = response.data;

      // Open Cashfree payment form
      cashfree.checkout({
        paymentSessionId,
        returnUrl: "http://localhost:3000/api/payment/return", // Your return URL
        redirectTarget: "_self", // Open in the same tab
      });
    } catch (error) {
      console.error(
        "Error initiating payment:",
        error.response?.data || error.message
      );
      alert("Failed to initiate payment. Please try again.");
    }
  });
});
