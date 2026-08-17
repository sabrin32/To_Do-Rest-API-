const Task = require("../models/taskStore");
const mongoose = require("mongoose");

const isInvalidId = (id) => !mongoose.isValidObjectId(id) && typeof id !== "string";

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, isCompleted, dueDate } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Title is required and cannot be empty",
      });
    }

    if (title.trim().length > 100) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Title cannot exceed 100 characters",
      });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      isCompleted: Boolean(isCompleted),
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    return res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks (with optional ?completed=true query filter)
// @route   GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const filter = {};
    const { completed } = req.query;

    if (completed !== undefined) {
      filter.isCompleted = completed === "true";
    }

    const tasks = await Task.find(filter);
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isInvalidId(id)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid task ID format",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        error: "Not Found",
        message: `Task resource with id ${id} does not exist`,
      });
    }

    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task by ID (supports full PUT or partial PATCH)
// @route   PUT /api/tasks/:id or PATCH /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted, dueDate } = req.body;

    if (isInvalidId(id)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid task ID format",
      });
    }

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
          error: "Bad Request",
          message: "Title cannot be empty",
        });
      }
      if (title.trim().length > 100) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Title cannot exceed 100 characters",
        });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(title !== undefined && { title: title.trim() }),
          ...(description !== undefined && { description: description.trim() }),
          ...(isCompleted !== undefined && { isCompleted: Boolean(isCompleted) }),
          ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        error: "Not Found",
        message: `Task resource with id ${id} does not exist`,
      });
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task by ID
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isInvalidId(id)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid task ID format",
      });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        error: "Not Found",
        message: `Task resource with id ${id} does not exist`,
      });
    }

    return res.status(200).json({
      message: "Task successfully deleted",
      id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};
