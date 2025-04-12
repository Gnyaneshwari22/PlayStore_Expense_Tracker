const apiurl = "http://65.0.105.253:3000";

const handleSignup = async (payload) => {
  try {
    const response = await axios.post(`${apiurl}/user/signup`, payload);
    console.log("Signup successful:", response.data);

    // Show success popup
    Swal.fire({
      icon: "success",
      title: "Signup Successful!",
      text: "Your account has been created.",
    }).then(() => {
      // Redirect to login page after the popup is closed
      window.location.href = "../login/login.html";
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

//Adding event listner to the signup form

let signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  // Get form data
  const payload = getFormData("signupForm");
  // Handle signup
  await handleSignup(payload);
});
