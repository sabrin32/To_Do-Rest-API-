const mongoose = require("mongoose");
const TaskModel = require("./Task");

// In-Memory Fallback Task Store for offline execution without local MongoDB daemon
const memoryTasks = new Map();

function generateMockId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  return timestamp.padStart(8, "0") + "f47ac10b58cc4372".slice(0, 16);
}

// Seed initial task if memory store is empty
const initialId = "66b8d4e92a1b3c4d5e6f7a8b";
memoryTasks.set(initialId, {
  id: initialId,
  _id: initialId,
  title: "Setup Node.js Express REST API Architecture",
  description: "Configure server, route handlers, schema models, and central error middleware for CSE 230 Lesson 7",
  isCompleted: true,
  dueDate: new Date("2026-08-15T23:59:59.000Z"),
  createdAt: new Date(),
  updatedAt: new Date(),
});

class TaskStore {
  static isMongoConnected() {
    return mongoose.connection.readyState === 1;
  }

  static async create(data) {
    if (this.isMongoConnected()) {
      return await TaskModel.create(data);
    }
    const id = generateMockId();
    const now = new Date();
    const task = {
      id,
      _id: id,
      title: data.title.trim(),
      description: data.description ? data.description.trim() : "",
      isCompleted: Boolean(data.isCompleted),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      createdAt: now,
      updatedAt: now,
    };
    memoryTasks.set(id, task);
    return task;
  }

  static async find(filter = {}) {
    if (this.isMongoConnected()) {
      return await TaskModel.find(filter).sort({ createdAt: -1 });
    }
    let list = Array.from(memoryTasks.values());
    if (filter.isCompleted !== undefined) {
      list = list.filter((t) => t.isCompleted === filter.isCompleted);
    }
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }

  static async findById(id) {
    if (this.isMongoConnected()) {
      return await TaskModel.findById(id);
    }
    return memoryTasks.get(id) || null;
  }

  static async findByIdAndUpdate(id, updates) {
    if (this.isMongoConnected()) {
      return await TaskModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    }
    const task = memoryTasks.get(id);
    if (!task) return null;

    if (updates.$set) {
      const s = updates.$set;
      if (s.title !== undefined) task.title = s.title.trim();
      if (s.description !== undefined) task.description = s.description.trim();
      if (s.isCompleted !== undefined) task.isCompleted = Boolean(s.isCompleted);
      if (s.dueDate !== undefined) task.dueDate = s.dueDate ? new Date(s.dueDate) : null;
    } else {
      if (updates.title !== undefined) task.title = updates.title.trim();
      if (updates.description !== undefined) task.description = updates.description.trim();
      if (updates.isCompleted !== undefined) task.isCompleted = Boolean(updates.isCompleted);
      if (updates.dueDate !== undefined) task.dueDate = updates.dueDate ? new Date(updates.dueDate) : null;
    }
    task.updatedAt = new Date();
    memoryTasks.set(id, task);
    return task;
  }

  static async findByIdAndDelete(id) {
    if (this.isMongoConnected()) {
      return await TaskModel.findByIdAndDelete(id);
    }
    const task = memoryTasks.get(id);
    if (!task) return null;
    memoryTasks.delete(id);
    return task;
  }
}

module.exports = TaskStore;
