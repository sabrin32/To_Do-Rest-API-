# Collaborative To-Do List REST API Server

A production-ready Node.js, Express, and MongoDB Mongoose REST API built for CSE 230 Web Design & Development (Lesson 7 Assignment).

## 🌟 Key Features
- **Full CRUD Endpoints**: Complete RESTful operations for managing task resources (`POST`, `GET All`, `GET Individual`, `PUT/PATCH`, `DELETE`).
- **Data Model Schema**: Standardized Mongoose model with auto-generated ID, trimmed title validation, description, completion status, due dates, and automatic `createdAt` / `updatedAt` timestamps.
- **Request Payload Validation**: Custom middleware (`validateTaskPayload`) ensuring mandatory titles, length boundaries (max 100 characters), and non-empty strings returning `400 Bad Request`.
- **Query Parameter Filtering**: `GET /api/tasks?completed=true` filtering tasks by completion state.
- **Global Central Error Handling**: Catches invalid ObjectIDs (`404 Not Found`) and unexpected drops (`500 Internal Server Error`) without leaking stack traces.
- **CORS & Environment Configurations**: Fully configured with `cors` and `dotenv`.

---

## 🛠️ Technology Stack
- **Runtime Environment**: Node.js
- **Web Framework**: Express v4
- **Database / ORM**: MongoDB with Mongoose v8
- **Middleware**: CORS, Dotenv, Custom Validation & Error Handlers
- **API Testing**: Postman Collection (`Week7_Postman_Collection.json`)

---

## 🚀 Quick Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ankit9424-prog/Todo-REST-API.git
   cd Todo-REST-API
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/todo_db
   ```

4. **Start the API Server**:
   ```bash
   # Production mode
   npm start

   # Development watch mode
   npm run dev
   ```

---

## 📬 REST API Endpoint Documentation

| Method | Endpoint | Description | Expected Status Codes |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | API status landing page & endpoint directory | `200 OK` |
| **POST** | `/api/tasks` | Create a new task (Requires JSON body with `title`) | `201 Created`, `400 Bad Request` |
| **GET** | `/api/tasks` | Retrieve all tasks (Supports `?completed=true` filter) | `200 OK` |
| **GET** | `/api/tasks/:id` | Retrieve an individual task by ID | `200 OK`, `404 Not Found` |
| **PUT / PATCH** | `/api/tasks/:id` | Update an existing task resource | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/api/tasks/:id` | Remove a task resource by ID | `200 OK`, `404 Not Found` |

---

## 📬 Postman Collection
Import the exported **`Week7_Postman_Collection.json`** file into Postman to test pre-configured requests for all 5 endpoints.

---
*Created by Ankit Katwal for CSE 230 Web Design & Development.*
