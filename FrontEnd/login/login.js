// // Handle login
// const handleLogin = async (payload) => {
//   try {
//     const response = await axios.post(
//       "http://localhost:3000/user/login",
//       payload
//     );
//     console.log("Login successful:", response.data);

//     // Show success popup
//     Swal.fire({
//       icon: "success",
//       title: "Login Successful!",
//       text: "You have successfully logged in.",
//     }).then(() => {
//       // Store the token in localStorage
//       localStorage.setItem("token", response.data.token);

//       // Redirect to the expenses page
//       window.location.href = "../expenses/expense.html";
//     });
//   } catch (error) {
//     console.error(
//       "Login failed:",
//       error.response ? error.response.data : error.message
//     );

//     // Show error popup
//     if (error.response && error.response.data.message) {
//       Swal.fire({
//         icon: "error",
//         title: "Login Failed",
//         text: error.response.data.message,
//       });
//     } else {
//       Swal.fire({
//         icon: "error",
//         title: "Login Failed",
//         text: "An error occurred. Please try again.",
//       });
//     }
//   }
// };

// // Get form data
// const getFormData = (formId) => {
//   const form = document.getElementById(formId);
//   return {
//     email: form.email ? form.email.value : null,
//     password: form.password ? form.password.value : null,
//   };
// };

// // Attach event listener to the login form
// if (document.getElementById("loginForm")) {
//   document
//     .getElementById("loginForm")
//     .addEventListener("submit", async (event) => {
//       event.preventDefault(); // Prevent form submission

//       // Get form data
//       const payload = getFormData("loginForm");

//       // Handle login
//       await handleLogin(payload);
//     });
// }

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

// Show Forgot Password Form
if (document.getElementById("forgotPasswordLink")) {
  document
    .getElementById("forgotPasswordLink")
    .addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default link behavior
      document.getElementById("loginForm").style.display = "none"; // Hide login form
      document.getElementById("forgotPasswordForm").style.display = "block"; // Show forgot password form
    });
}

// Handle Forgot Password Form Submission
if (document.getElementById("forgotPasswordFormContent")) {
  document
    .getElementById("forgotPasswordFormContent")
    .addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent form submission

      const email = document.getElementById("forgotPasswordEmail").value;

      if (!email) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter your email address.",
        });
        return;
      }

      try {
        // Call the backend API to send the reset password email
        const response = await axios.post(
          "http://localhost:3000/password/forgotpassword",
          {
            email,
          }
        );

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
        });

        // Hide the forgot password form and show the login form
        document.getElementById("forgotPasswordForm").style.display = "none";
        document.getElementById("loginForm").style.display = "block";
      } catch (error) {
        // Show error message
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to send password reset email. Please try again.",
        });
        console.error(error);
      }
    });
}
