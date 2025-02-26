// // Function to handle signup
// const handleSignup = async (payload) => {
//   try {
//     const response = await axios.post(
//       "http://localhost:3000/user/signup",
//       payload
//     );
//     console.log("Signup successful:", response.data);

//     // Show success popup
//     Swal.fire({
//       icon: "success",
//       title: "Signup Successful!",
//       text: "Your account has been created.",
//     }).then(() => {
//       // Redirect to login page after the popup is closed
//       window.location.href = "login.html";
//     });
//   } catch (error) {
//     console.error(
//       "Signup failed:",
//       error.response ? error.response.data : error.message
//     );

//     // Show error popup
//     if (error.response && error.response.data.message) {
//       Swal.fire({
//         icon: "error",
//         title: "Signup Failed",
//         text: error.response.data.message,
//       });
//     } else {
//       Swal.fire({
//         icon: "error",
//         title: "Signup Failed",
//         text: "An error occurred. Please try again.",
//       });
//     }
//   }
// };

// // Function to get form data
// const getFormData = (formId) => {
//   const form = document.getElementById(formId);
//   return {
//     username: form.username.value,
//     email: form.email.value,
//     password: form.password.value,
//     phone: form.phone.value,
//   };
// };

// // Attach event listener to the signup form
// document
//   .getElementById("signupForm")
//   .addEventListener("submit", async (event) => {
//     event.preventDefault(); // Prevent form submission

//     // Get form data
//     const payload = getFormData("signupForm");

//     // Handle signup
//     await handleSignup(payload);
//   });
//////////////////////////////////////////////////
// Function to handle signup
const handleSignup = async (payload) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/user/signup",
      payload
    );
    console.log("Signup successful:", response.data);

    // Show success popup
    Swal.fire({
      icon: "success",
      title: "Signup Successful!",
      text: "Your account has been created.",
    }).then(() => {
      // Redirect to login page after the popup is closed
      window.location.href = "login.html";
    });
  } catch (error) {
    console.error(
      "Signup failed:",
      error.response ? error.response.data : error.message
    );

    // Show error popup
    if (error.response && error.response.data.message) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.response.data.message,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: "An error occurred. Please try again.",
      });
    }
  }
};

// Function to handle login
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
      // Redirect to dashboard or home page after the popup is closed
      window.location.href = "dashboard.html"; // Change this to your desired page
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

// Function to get form data
const getFormData = (formId) => {
  const form = document.getElementById(formId);
  return {
    username: form.username ? form.username.value : null,
    email: form.email ? form.email.value : null,
    password: form.password ? form.password.value : null,
    phone: form.phone ? form.phone.value : null,
  };
};

// Attach event listener to the signup form
if (document.getElementById("signupForm")) {
  document
    .getElementById("signupForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent form submission

      // Get form data
      const payload = getFormData("signupForm");

      // Handle signup
      await handleSignup(payload);
    });
}

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
