const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();

// Initialize Sendinblue API client
SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
  process.env.SENDIN_API_KEY;

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Send email using Sendinblue
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.sender = {
    email: "gnyaneshwariadki2@gmail.com",
    name: "Gnayneshwari",
  };
  sendSmtpEmail.subject = "Password Reset Request";
  sendSmtpEmail.htmlContent =
    "<p>This is a dummy email for password reset.</p>";

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send password reset email" });
  }
};

module.exports = { forgotPassword };
