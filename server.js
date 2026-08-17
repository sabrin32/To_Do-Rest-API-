require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const notFound = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json());

// API Health Check & Documentation Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Active",
    application: "Collaborative To-Do List REST API",
    author: "Ankit Katwal",
    course: "CSE 230 Web Design & Development",
    endpoints: {
      health: "GET /",
      createTask: "POST /api/tasks",
      getAllTasks: "GET /api/tasks (filter: ?completed=true)",
      getTaskById: "GET /api/tasks/:id",
      updateTask: "PUT/PATCH /api/tasks/:id",
      deleteTask: "DELETE /api/tasks/:id",
    },
  });
});

// Mount Routes
app.use("/api/tasks", taskRoutes);

// 404 & Central Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`[Server] REST API running on http://127.0.0.1:${PORT}`);
});

module.exports = app;
