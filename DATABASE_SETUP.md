# MongoDB Database Setup Guide

This guide explains how to set up and connect a MongoDB database for the To-Do List REST API.

---

## Option 1: MongoDB Atlas (Cloud Database - Recommended)

1. **Create an Account**: Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. **Create a Free Cluster**: Click **Create Cluster** and choose the free **M0 Shared** tier.
3. **Database User**: Under **Database Access**, create a database user (username and password).
4. **Network Access**: Under **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`) for development.
5. **Get Connection String**:
   - In **Database Deployments**, click **Connect** -> **Drivers** -> **Node.js**.
   - Copy the connection string URI.
6. **Set Environment Variable**:
   In your `.env` file, paste the URI:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/todo_db?retryWrites=true&w=majority
   ```

---

## Option 2: Local MongoDB Community Edition

1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community).
2. Start the local MongoDB service on your machine.
3. In your `.env` file, set:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/todo_db
   ```

---

## Option 3: Automatic In-Memory Fallback
If MongoDB is not running locally, the application includes a built-in memory fallback provider (`models/taskStore.js`) so that all REST API routes function immediately without installation.
