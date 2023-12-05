const JsonWebTokenError = require("jsonwebtoken");
const User = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");

// Middleware to protect routes by verifying JWT
const protect = expressAsyncHandler(async (req, res, next) => {
  let token;

  // Check if the request headers contain a valid Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using the provided secret ("kanhaiya" in this case)
      const decoded = JsonWebTokenError.verify(token, "kanhaiya");

      // Attach the user information to the request for further processing
      req.user = await User.findById(decoded.id).select("-password");

      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      // Log the error and send a 401 Unauthorized response if token verification fails
      console.log(error);
      res.status(401).send({
        error: "You are not logged in",
      });
    }
  }

  // If no token is found or the above block doesn't execute, send a 401 response
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});

module.exports = { protect };
