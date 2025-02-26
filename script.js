document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get form data
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;

    // Create payload
    const payload = {
      username: username,
      email: email,
      password: password,
      phone: phone,
    };

    // Send POST request using Axios
    axios
      .post("http://localhost:3000/user/signup", payload)
      .then(function (response) {
        console.log("Signup successful:", response.data);
        alert("Signup successful!");
      })
      .catch(function (error) {
        console.error(
          "Signup failed:",
          error.response ? error.response.data : error.message
        );
        alert("Signup failed. Please try again.");
      });
  });
