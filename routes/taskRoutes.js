const express = require("express");
const router = express.Router();
const Task = require("../models/taskStore");
const { validateTaskPayload } = require("../middleware/validateTask");

/**
 * @route   POST /api/tasks
 * @desc    Create a new task resource
 * @access  Public
 */
router.post("/", validateTaskPayload, async (req, res, next) => {
  try {
    const { title, description, isCompleted, dueDate } = req.body;

    const newTask = await Task.create({
      title,
      description,
      isCompleted,
      dueDate,
    });

    return res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/tasks
 * @desc    Retrieve all tasks (with optional ?completed=true filter)
 * @access  Public
 */
router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    const { completed } = req.query;

    if (completed !== undefined) {
      filter.isCompleted = completed === "true";
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/tasks/:id
 * @desc    Retrieve an individual task by path parameter ID
 * @access  Public
 */
router.get("/:id", async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: "Not Found",
        message: `Task resource with id ${req.params.id} does not exist`,
      });
    }

    return res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   PUT /api/tasks/:id (also handles PATCH)
 * @desc    Update an existing task resource
 * @access  Public
 */
router.put("/:id", validateTaskPayload, async (req, res, next) => {
  try {
    const { title, description, isCompleted, dueDate } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(isCompleted !== undefined && { isCompleted }),
          ...(dueDate !== undefined && { dueDate }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        error: "Not Found",
        message: `Task resource with id ${req.params.id} does not exist`,
      });
    }

    return res.status(200).json(updatedTask);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", validateTaskPayload, async (req, res, next) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        error: "Not Found",
        message: `Task resource with id ${req.params.id} does not exist`,
      });
    }

    return res.status(200).json(updatedTask);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task resource by ID
 * @access  Public
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        error: "Not Found",
        message: `Task resource with id ${req.params.id} does not exist`,
      });
    }

    return res.status(200).json({
      message: "Task successfully deleted",
      id: req.params.id,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
