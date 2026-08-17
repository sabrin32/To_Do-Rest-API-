const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todo_db";
    await mongoose.connect(uri);
    console.log(`[Database] MongoDB connected successfully to ${uri}`);
  } catch (error) {
    console.warn(`[Database Connection Alert] ${error.message}`);
    console.log("[Database] Server running with fallback memory support");
  }
};

module.exports = connectDB;
