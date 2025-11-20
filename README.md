## 🚀 UI Preview

### 🟣 Login Page
![Login Page](UI/login.png)

### 🟡 Dashboard
![Dashboard](UI/dashboard.png)


# TaskFlow - Task Management Application

## Tech Stack
- **Frontend**: React + Vite, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Features
- User Authentication (Signup/Login)
- Task CRUD Operations
- Search & Filter Tasks
- Responsive Design
- Protected Routes

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB installed and running
- npm or yarn

### Backend Setup
1. Navigate to backend folder
```bash
   cd task-manager
```

2. Install dependencies
```bash
   npm install
```

3. Create `.env` file (optional)
```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your_secret_key_here
```

4. Start the server
```bash
   node server.js
```

### Frontend Setup
1. Navigate to frontend folder
```bash
   cd frontend
```

2. Install dependencies
```bash
   npm install
```

3. Start development server
```bash
   npm run dev
```

4. Open browser at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (protected)
- `GET /api/tasks/:id` - Get single task (protected)
- `POST /api/tasks` - Create task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)
- `GET /api/tasks/stats/summary` - Get task statistics (protected)

## Default Login
You can create a new account or use test credentials after signup.

## Project Structure
```
task-manager/
├── server.js          # Backend server
├── frontend/          # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
└── package.json
```
# TaskFlow API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### 1. User Signup
**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "JD"
  }
}
```

### 2. User Login
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "JD"
  }
}
```

### 3. Get User Profile
**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "JD"
  }
}
```

## Task Endpoints (All require Authentication)

### 4. Get All Tasks
**Endpoint:** `GET /tasks?status=all&priority=all&search=`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "tasks": [
    {
      "_id": "task123",
      "userId": "user123",
      "title": "Complete project",
      "description": "Finish the task manager app",
      "status": "in-progress",
      "priority": "high",
      "createdAt": "2025-01-20T10:00:00.000Z",
      "updatedAt": "2025-01-20T10:00:00.000Z"
    }
  ]
}
```

### 5. Create Task
**Endpoint:** `POST /tasks`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description here",
  "status": "pending",
  "priority": "medium"
}
```

**Response (201):**
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "task123",
    "title": "New Task",
    "description": "Task description here",
    "status": "pending",
    "priority": "medium",
    "createdAt": "2025-01-20T10:00:00.000Z"
  }
}
```

### 6. Update Task
**Endpoint:** `PUT /tasks/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "status": "completed",
  "priority": "high"
}
```

### 7. Delete Task
**Endpoint:** `DELETE /tasks/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

### 8. Get Task Statistics
**Endpoint:** `GET /tasks/stats/summary`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "stats": {
    "total": 10,
    "pending": 3,
    "in-progress": 4,
    "completed": 3
  }
}
```

## Error Responses

**400 Bad Request:**
```json
{
  "error": "All fields are required"
}
```

**401 Unauthorized:**
```json
{
  "error": "Access token required"
}
```

**403 Forbidden:**
```json
{
  "error": "Invalid or expired token"
}
```

**404 Not Found:**
```json
{
  "error": "Task not found"
}
```

**500 Server Error:**
```json
{
  "error": "Server error"
}
```
