const validateTaskPayload = (req, res, next) => {
  const { title } = req.body;

  // Title validation for POST requests or PUT requests with title
  if (req.method === "POST" || (req.method === "PUT" && title !== undefined)) {
    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Task title is required and cannot be empty",
      });
    }

    if (title.trim().length > 100) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Task title cannot exceed 100 characters",
      });
    }
  }

  next();
};

module.exports = { validateTaskPayload };
