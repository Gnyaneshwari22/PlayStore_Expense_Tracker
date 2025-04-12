// DOM Elements
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const resetForm = document.getElementById("resetPasswordForm");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

// Extract the requestId from the URL
const urlParams = new URLSearchParams(window.location.search);
const requestId = urlParams.get("requestId");

// Password strength indicator
const passwordStrength = document.createElement("div");
passwordStrength.className = "password-strength";
newPasswordInput.parentNode.insertBefore(
  passwordStrength,
  newPasswordInput.nextSibling
);

// Initialize the application
async function init() {
  if (!requestId) {
    showError("Invalid password reset link. Please request a new one.");
    return;
  }

  try {
    await verifyResetToken(requestId);
    setupForm();
  } catch (error) {
    showError(error.message);
    console.error("Initialization failed:", error);
  }
}

// Verify the reset token with backend
async function verifyResetToken(token) {
  try {
    const response = await axios.get(
      `http://65.0.105.253:3000/password/resetpassword/${token}`
    );

    loadingMessage.classList.add("hidden");
    resetForm.classList.remove("hidden");
    return true;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Invalid or expired reset link. Please request a new one."
    );
  }
}

// Set up form submission handler
function setupForm() {
  // Password strength indicator
  newPasswordInput.addEventListener("input", updatePasswordStrength);

  // Form submission
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!validatePasswords(newPassword, confirmPassword)) {
      return;
    }

    try {
      await updatePassword(requestId, newPassword);
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Password updated successfully!",
      });
      redirectToLogin();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to reset password.",
      });
      console.error(error);
    }
  });
}

// Validate password inputs
function validatePasswords(newPassword, confirmPassword) {
  if (newPassword !== confirmPassword) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Passwords do not match.",
    });
    return false;
  }

  if (newPassword.length < 8) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Password must be at least 8 characters.",
    });
    return false;
  }

  return true;
}

// Update password via API
async function updatePassword(token, newPassword) {
  const response = await axios.post(
    "http://65.0.105.253:3000/password/updatepassword",
    { requestId: token, newPassword }
  );
  return response;
}

// Show password strength indicator
function updatePasswordStrength() {
  const password = newPasswordInput.value;
  let strength = 0;

  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Complexity checks
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  // Update visual indicator
  passwordStrength.className = "password-strength ";
  if (password.length === 0) {
    passwordStrength.className += "hidden";
  } else if (strength < 3) {
    passwordStrength.className += "strength-weak";
  } else if (strength < 5) {
    passwordStrength.className += "strength-medium";
  } else {
    passwordStrength.className += "strength-strong";
  }
}

// Show error message
function showError(message) {
  loadingMessage.classList.add("hidden");
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  setTimeout(redirectToLogin, 5000);
}

// Redirect to login page
function redirectToLogin() {
  window.location.href = "http://65.0.105.253/FrontEnd/login/login.html";
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
