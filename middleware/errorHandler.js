const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] ${err.name}: ${err.message}`);

  // Invalid MongoDB ObjectId Format
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(404).json({
      error: "Not Found",
      message: `Task resource not found with id ${err.value}`,
    });
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: "Bad Request",
      message: messages.join(", "),
    });
  }

  // Default Central 500 Internal Server Error Handler
  res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected system error occurred on the server",
  });
};

module.exports = errorHandler;
