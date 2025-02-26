const User = require("../models/user");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

module.exports = { signup };
