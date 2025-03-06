const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const ForgotPasswordRequest = require("../models/ForgotPasswordRequest");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Initialize Sendinblue API client
SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
  process.env.SENDIN_API_KEY;

// const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   // Validate email
//   if (!email) {
//     return res.status(400).json({ message: "Email is required" });
//   }

//   // Send email using Sendinblue
//   const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
//   sendSmtpEmail.to = [{ email }];
//   sendSmtpEmail.sender = {
//     email: "gnyaneshwariadki2@gmail.com",
//     name: "Gnayneshwari",
//   };
//   sendSmtpEmail.subject = "Password Reset Request";
//   sendSmtpEmail.htmlContent =
//     "<p>This is a dummy email for password reset.</p>";

//   const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

//   try {
//     await apiInstance.sendTransacEmail(sendSmtpEmail);
//     res.status(200).json({ message: "Password reset email sent successfully" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).json({ message: "Failed to send password reset email" });
//   }
// };

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Find the user by email (assuming you have a User model)
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a UUID for the reset link
    const requestId = uuidv4();

    // Create a new forgot password request
    await ForgotPasswordRequest.create({
      id: requestId,
      userId: user.id,
      isActive: true,
    });
    // Send email with the reset link
    const resetUrl = `http://localhost:3000/password/resetpassword/${requestId}`;
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.sender = {
      email: "gnyaneshwariadki2@gmail.com",
      name: "Gnayneshwari",
    };
    sendSmtpEmail.subject = "Password Reset Request";
    sendSmtpEmail.htmlContent = `<p>Click the link to reset your password: <a href="${resetUrl}">Reset Password</a></p>`;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send password reset email" });
  }
};
//update password
const updatePassword = async (req, res) => {
  const { requestId, newPassword } = req.body;

  try {
    // Find the forgot password request
    const request = await ForgotPasswordRequest.findOne({
      where: { id: requestId, isActive: true },
    });

    if (!request) {
      return res.status(404).json({ message: "Invalid or expired reset link" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const user = await User.findByPk(request.userId);
    user.password = hashedPassword;
    await user.save();

    // Deactivate the request
    request.isActive = false;
    await request.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//When the user clicks the reset link, check if the request exists and is active.
const resetPasswordForm = async (req, res) => {
  const { requestId } = req.params;
  console.log("Request ID:", requestId);
  console.log("Query Result:", req);
  try {
    // Find the forgot password request
    const request = await ForgotPasswordRequest.findOne({
      where: { id: requestId, isActive: true },
    });

    if (!request) {
      return res.status(404).json({ message: "Invalid or expired reset link" });
    }

    // Render the reset password form (or return a JSON response)
    res.status(200).json({ message: "Valid reset link" });
  } catch (error) {
    console.error("Error finding reset request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { forgotPassword, updatePassword, resetPasswordForm };
