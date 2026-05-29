// ============================================
// app.js — Express application setup
// Configure middleware and routes here
// ============================================

const express    = require('express');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// ── MIDDLEWARE ────────────────────────────────
// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Simple request logger middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next(); // Always call next() to pass control to the next middleware
});

// ── ROUTES ────────────────────────────────────
// Mount task routes at /api/tasks
app.use('/api/tasks', taskRoutes);

// Root endpoint — health check
app.get('/', (req, res) => {
  res.json({
    success : true,
    message : 'Task Manager API is running!',
    version : '1.0.0',
    endpoints: {
      getAllTasks   : 'GET    /api/tasks',
      getTaskById  : 'GET    /api/tasks/:id',
      createTask   : 'POST   /api/tasks',
      updateTask   : 'PUT    /api/tasks/:id',
      deleteTask   : 'DELETE /api/tasks/:id',
    }
  });
});

// ── ERROR HANDLING ────────────────────────────
// 404 handler — catches any undefined routes
app.use((req, res) => {
  res.status(404).json({
    success : false,
    message : `Route ${req.method} ${req.url} not found`,
  });
});

// Global error handler — catches any server errors
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success : false,
    message : 'Internal server error',
    error   : process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

module.exports = app;