// Helper function to get the Authorization header with the token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Helper function to handle API errors (e.g., token expiry)
const handleApiError = (error) => {
  if (error.response && error.response.status === 401) {
    // Token is expired or invalid
    localStorage.removeItem("token"); // Clear the token
    Swal.fire({
      icon: "error",
      title: "Session Expired",
      text: "Please log in again.",
    }).then(() => {
      window.location.href = "../login/login.html"; // Redirect to login page
    });
  } else {
    console.error("API Error:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred. Please try again.",
    });
  }
};

// Handle login
const handleLogin = async (payload) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/user/login",
      payload
    );
    console.log("Login successful:", response.data);

    // Show success popup
    Swal.fire({
      icon: "success",
      title: "Login Successful!",
      text: "You have successfully logged in.",
    }).then(() => {
      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect to the expenses page
      window.location.href = "../expenses/expense.html";
    });
  } catch (error) {
    console.error(
      "Login failed:",
      error.response ? error.response.data : error.message
    );

    // Show error popup
    if (error.response && error.response.data.message) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response.data.message,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "An error occurred. Please try again.",
      });
    }
  }
};

// Get form data
const getFormData = (formId) => {
  const form = document.getElementById(formId);
  return {
    email: form.email ? form.email.value : null,
    password: form.password ? form.password.value : null,
  };
};

// Attach event listener to the login form
if (document.getElementById("loginForm")) {
  document
    .getElementById("loginForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent form submission

      // Get form data
      const payload = getFormData("loginForm");

      // Handle login
      await handleLogin(payload);
    });
}
