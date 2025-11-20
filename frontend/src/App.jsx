import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, LogOut, CheckCircle, Clock, AlertCircle, Menu, X, Eye, EyeOff, Filter } from 'lucide-react';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

const App = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAuth, setShowAuth] = useState(true);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authErrors, setAuthErrors] = useState({});
  
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'pending', priority: 'medium' });
  const [taskErrors, setTaskErrors] = useState({});

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
      setShowAuth(false);
      loadTasks(savedToken);
    }
  }, []);

  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');
      return data;
    } catch (error) {
      throw error;
    }
  };

  const loadTasks = async () => {
    try {
      const data = await apiCall('/tasks');
      setTasks(data.tasks);
    } catch (error) {
      console.error('Load tasks error:', error);
    }
  };

  const validateAuth = () => {
    const errors = {};
    if (isSignup && !authForm.name.trim()) errors.name = 'Name is required';
    if (!authForm.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(authForm.email)) errors.email = 'Invalid email';
    if (!authForm.password) errors.password = 'Password is required';
    else if (authForm.password.length < 6) errors.password = 'Password must be 6+ characters';
    setAuthErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAuth = async () => {
    if (!validateAuth()) return;
    
    setIsLoading(true);
    try {
      const endpoint = isSignup ? '/auth/signup' : '/auth/login';
      const body = isSignup 
        ? { name: authForm.name, email: authForm.email, password: authForm.password }
        : { email: authForm.email, password: authForm.password };

      const data = await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
      });

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      setShowAuth(false);
      loadTasks(data.token);
      setAuthForm({ name: '', email: '', password: '' });
    } catch (error) {
      setAuthErrors({ general: error.message });
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setShowAuth(true);
    setTasks([]);
  };

  const validateTask = () => {
    const errors = {};
    if (!taskForm.title.trim()) errors.title = 'Title is required';
    if (!taskForm.description.trim()) errors.description = 'Description is required';
    setTaskErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleTaskSubmit = async () => {
    if (!validateTask()) return;

    setIsLoading(true);
    try {
      if (currentTask) {
        const data = await apiCall(`/tasks/${currentTask._id}`, {
          method: 'PUT',
          body: JSON.stringify(taskForm)
        });
        setTasks(tasks.map(t => t._id === currentTask._id ? data.task : t));
      } else {
        const data = await apiCall('/tasks', {
          method: 'POST',
          body: JSON.stringify(taskForm)
        });
        setTasks([data.task, ...tasks]);
      }
      
      setShowModal(false);
      setCurrentTask(null);
      setTaskForm({ title: '', description: '', status: 'pending', priority: 'medium' });
      setTaskErrors({});
    } catch (error) {
      setTaskErrors({ general: error.message });
    }
    setIsLoading(false);
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await apiCall(`/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      alert('Failed to delete task: ' + error.message);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-600" />;
      default: return <AlertCircle className="w-5 h-5 text-amber-600" />;
    }
  };

  if (showAuth) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <CheckCircle style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
            </div>
            <h1 className="auth-title">
              {isSignup ? 'Join TaskFlow' : 'Welcome Back'}
            </h1>
            <p className="auth-subtitle">
              {isSignup ? 'Create your account to get started' : 'Sign in to continue your journey'}
            </p>
          </div>

          <div className="form-group">
            {authErrors.general && (
              <div className="error-alert">
                <AlertCircle style={{ width: '1rem', height: '1rem' }} />
                <span>{authErrors.general}</span>
              </div>
            )}

            {isSignup && (
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                  onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  className={`form-input ${authErrors.name ? 'error' : ''}`}
                  placeholder="John Doe"
                />
                {authErrors.name && <p className="error-text">{authErrors.name}</p>}
              </div>
            )}

            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                className={`form-input ${authErrors.email ? 'error' : ''}`}
                placeholder="you@example.com"
              />
              {authErrors.email && <p className="error-text">{authErrors.email}</p>}
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  className={`form-input ${authErrors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff style={{ width: '1.25rem', height: '1.25rem' }} /> : <Eye style={{ width: '1.25rem', height: '1.25rem' }} />}
                </button>
              </div>
              {authErrors.password && <p className="error-text">{authErrors.password}</p>}
            </div>

            <button
              onClick={handleAuth}
              disabled={isLoading}
              className="btn btn-primary btn-full"
            >
              {isLoading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
            </button>
          </div>

          <div className="auth-toggle">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setAuthErrors({});
              }}
              className="auth-toggle-btn"
            >
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="header-logo">
              <div className="logo-icon">
                <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <div className="logo-text">
                <h1>TaskFlow</h1>
                <p>Manage tasks efficiently</p>
              </div>
            </div>

            <div className="header-actions">
              <div className="user-info">
                <div className="user-avatar">{user?.avatar}</div>
                <div className="user-details">
                  <p className="user-name">{user?.name}</p>
                  <p className="user-email">{user?.email}</p>
                </div>
              </div>

              <button onClick={handleLogout} className="btn btn-danger">
                <LogOut style={{ width: '1rem', height: '1rem' }} />
                <span>Logout</span>
              </button>

              <button onClick={() => setShowMenu(!showMenu)} className="menu-toggle">
                {showMenu ? <X style={{ width: '1.5rem', height: '1.5rem' }} /> : <Menu style={{ width: '1.5rem', height: '1.5rem' }} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">{user?.avatar}</div>
                <div>
                  <p style={{ fontWeight: '700', color: '#1e293b' }}>{user?.name}</p>
                  <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{user?.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-danger btn-full">
                <LogOut style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="main-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          {[
            { label: 'Total Tasks', value: tasks.length, color: 'violet', icon: CheckCircle },
            { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: 'green', icon: CheckCircle },
            { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: 'blue', icon: Clock },
            { label: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: 'amber', icon: AlertCircle }
          ].map((stat, idx) => (
            <div key={idx} className={`stat-card ${stat.color}`}>
              <div className="stat-content">
                <div>
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
                <div className={`stat-icon ${stat.color}`}>
                  <stat.icon style={{ width: '1.75rem', height: '1.75rem', color: 'white' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="search-bar">
          <div className="search-content">
            <div className="search-input-wrapper">
              <Search className="search-icon" style={{ width: '1.25rem', height: '1.25rem' }} />
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="search-filters">
              <div className="filter-wrapper">
                <Filter className="filter-icon" style={{ width: '1rem', height: '1rem' }} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setShowModal(true);
                  setCurrentTask(null);
                  setTaskForm({ title: '', description: '', status: 'pending', priority: 'medium' });
                }}
                className="btn btn-primary"
              >
                <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>New Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <CheckCircle style={{ width: '3.5rem', height: '3.5rem', color: '#8b5cf6' }} />
            </div>
            <h3 className="empty-title">No tasks found</h3>
            <p className="empty-text">
              Create your first task to get started on your productivity journey
            </p>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <Plus style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>Create Task</span>
            </button>
          </div>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map(task => (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <div className="task-badges">
                    {getStatusIcon(task.status)}
                    <span className={`priority-badge priority-${task.priority}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="task-actions">
                    <button onClick={() => handleEdit(task)} className="btn-icon edit">
                      <Edit2 style={{ width: '1rem', height: '1rem' }} />
                    </button>
                    <button onClick={() => handleDelete(task._id)} className="btn-icon delete">
                      <Trash2 style={{ width: '1rem', height: '1rem' }} />
                    </button>
                  </div>
                </div>

                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description}</p>

                <div className="task-footer">
                  <div className="task-date">
                    <Clock style={{ width: '1rem', height: '1rem' }} />
                    <span>{new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <span className={`status-badge status-${task.status}`}>
                    {task.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Task Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {currentTask ? 'Edit Task' : 'Create New Task'}
              </h2>
            </div>

            <div className="modal-body">
              {taskErrors.general && (
                <div className="error-alert">
                  <AlertCircle style={{ width: '1rem', height: '1rem' }} />
                  <span>{taskErrors.general}</span>
                </div>
              )}

              <div>
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  className={`form-input ${taskErrors.title ? 'error' : ''}`}
                  placeholder="Enter task title"
                />
                {taskErrors.title && <p className="error-text">{taskErrors.title}</p>}
              </div>

              <div>
                <label className="form-label">Description *</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  className={`form-textarea ${taskErrors.description ? 'error' : ''}`}
                  rows="4"
                  placeholder="Enter task description"
                />
                {taskErrors.description && <p className="error-text">{taskErrors.description}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label className="form-label">Status</label>
                  <select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({...taskForm, status: e.target.value})}
                    className="form-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                    className="form-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setCurrentTask(null);
                    setTaskErrors({});
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTaskSubmit}
                  disabled={isLoading}
                  className="btn btn-primary"
                >
                  {isLoading ? 'Saving...' : (currentTask ? 'Update Task' : 'Create Task')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;