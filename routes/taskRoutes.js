const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// Route mappings
router.route("/").post(createTask).get(getTasks);
router.route("/:id").get(getTask).put(updateTask).patch(updateTask).delete(deleteTask);

module.exports = router;
