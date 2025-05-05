const cashfree = Cashfree({ mode: "sandbox" });

document.getElementById("payButton").addEventListener("click", async () => {
  try {
    const orderAmount = 10000;
    const customerID = "user_123";
    const customerPhone = "9876543210";

    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/api/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderAmount, customerID, customerPhone }),
    });

    const data = await response.json();
    await cashfree.checkout({
      paymentSessionId: data.paymentSessionId,
      redirectTarget: "_self",
    });
  } catch (error) {
    console.error("Error during payment:", error);
    swal("Payment Failed", "Please try again.", "error");
  }
});
