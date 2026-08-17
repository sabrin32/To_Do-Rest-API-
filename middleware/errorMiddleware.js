// Global central error handler middleware
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal server error";

  // Invalid MongoDB ObjectId error
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid task ID format";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors || {}).map((e) => e.message);
    message = errors.length > 0 ? errors[0] : "Validation error";
  }

  res.status(statusCode).json({
    error: statusCode === 400 ? "Bad Request" : statusCode === 404 ? "Not Found" : "Internal Server Error",
    message,
  });
};

module.exports = errorHandler;
