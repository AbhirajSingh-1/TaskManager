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
