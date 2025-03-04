const jwt = require("jsonwebtoken");
const User = require("../models/User");

//console.log("JWT_SECRET from authMiddleware:", process.env.JWT_SECRET); // Debugging line

const authMiddleware = async (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  console.log("Token from header:", token);
  // If no token is provided, return an error
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findByPk(decoded.userId);

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach the user to the request object
    req.userId = user.id; // Attach userId to req

    req.user = user;
    console.log("User from request:======================>", req.user); // Debugging line

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
