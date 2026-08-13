require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo_db";

// Global Middleware
app.use(cors());
app.use(express.json());

// Root Landing Page Status & API Overview
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Active",
    application: "Collaborative To-Do List REST API Server",
    author: "Ankit Katwal",
    course: "CSE 230 Web Design & Development",
    database: mongoose.connection.readyState === 1 ? "Connected to MongoDB" : "Fallback / Connecting",
    endpoints: {
      createTask: "POST /api/tasks",
      getAllTasks: "GET /api/tasks (query filter ?completed=true)",
      getTaskById: "GET /api/tasks/:id",
      updateTask: "PUT /api/tasks/:id",
      deleteTask: "DELETE /api/tasks/:id",
    },
  });
});

// API Routes
app.use("/api/tasks", taskRoutes);

// Central Global Error Handler (Syllabus Requirement)
app.use(errorHandler);

// Database Connection & Server Initialization
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`[Database] Successfully connected to MongoDB at ${MONGODB_URI}`);
    app.listen(PORT, () => {
      console.log(`[Server] To-Do List REST API running on http://127.0.0.1:${PORT}`);
    });
  })
  .catch((err) => {
    console.warn(`[Database Connection Alert] ${err.message}`);
    console.log("[Server] Launching Express server on fallback mode...");
    app.listen(PORT, () => {
      console.log(`[Server] To-Do List REST API running on http://127.0.0.1:${PORT}`);
    });
  });

module.exports = app;
