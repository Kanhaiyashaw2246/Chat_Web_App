// Middleware for handling 404 Not Found errors
const notFound = (req, res, next) => {
  // Create a new Error object with a descriptive message
  const error = new Error(`Not found - ${req.originalUrl}`);
  
  // Set the HTTP status code to 404 (Not Found)
  res.status(404);
  
  // Pass the error to the next middleware in the chain
  next(error);
};

// Middleware for handling general errors
const errorHandler = (err, req, res, next) => {
  // Determine the appropriate HTTP status code based on the response status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Set the HTTP status code for the response
  res.status(statusCode);
  
  // Log the error message to the console
  console.log("Error:", err.message);
  
  // Send a JSON response with error details
  res.json({
    message: err.message,
    
    // Include the stack trace in non-production environments for debugging
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

// Export the middleware functions for use in other parts of the application
module.exports = { notFound, errorHandler };
