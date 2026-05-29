// ============================================
// taskController.js — Business Logic Layer
// Handles all task-related operations
// Reads/writes to our JSON "database"
// ============================================

const fs   = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Path to our JSON data file
const DATA_FILE = path.join(__dirname, '../data/tasks.json');

// ── HELPER FUNCTIONS ──────────────────────────

/**
 * Read all tasks from the JSON file.
 * @returns {Array} Array of task objects
 */
const readTasks = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
};

/**
 * Write tasks array back to the JSON file.
 * @param {Array} tasks - Array of task objects to save
 */
const writeTasks = (tasks) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
};

// ── CONTROLLER METHODS ────────────────────────

/**
 * GET /api/tasks
 * Retrieve all tasks with optional filtering
 */
const getAllTasks = (req, res) => {
  try {
    let tasks = readTasks();

    // Optional: filter by status query param
    // Example: GET /api/tasks?status=completed
    const { status, priority } = req.query;

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (priority) {
      tasks = tasks.filter(task => task.priority === priority);
    }

    res.status(200).json({
      success : true,
      count   : tasks.length,
      data    : tasks,
    });
  } catch (error) {
    res.status(500).json({
      success : false,
      message : 'Failed to retrieve tasks',
    });
  }
};

/**
 * GET /api/tasks/:id
 * Retrieve a single task by ID
 */
const getTaskById = (req, res) => {
  try {
    const tasks = readTasks();
    const task  = tasks.find(t => t.id === req.params.id);

    // 404 if task not found
    if (!task) {
      return res.status(404).json({
        success : false,
        message : `Task with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success : true,
      data    : task,
    });
  } catch (error) {
    res.status(500).json({
      success : false,
      message : 'Failed to retrieve task',
    });
  }
};

/**
 * POST /api/tasks
 * Create a new task
 */
const createTask = (req, res) => {
  try {
    const { title, description, priority } = req.body;

    // Build the new task object
    const newTask = {
      id          : uuidv4(),           // Generate unique ID
      title       : title.trim(),
      description : description?.trim() || '',
      status      : 'todo',             // Default status
      priority    : priority || 'medium',
      createdAt   : new Date().toISOString(),
      updatedAt   : new Date().toISOString(),
    };

    // Read existing tasks, add new one, save back
    const tasks = readTasks();
    tasks.push(newTask);
    writeTasks(tasks);

    // 201 Created status for new resources
    res.status(201).json({
      success : true,
      message : 'Task created successfully',
      data    : newTask,
    });
  } catch (error) {
    res.status(500).json({
      success : false,
      message : 'Failed to create task',
    });
  }
};

/**
 * PUT /api/tasks/:id
 * Update an existing task completely
 */
const updateTask = (req, res) => {
  try {
    const tasks     = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);

    // 404 if task not found
    if (taskIndex === -1) {
      return res.status(404).json({
        success : false,
        message : `Task with ID ${req.params.id} not found`,
      });
    }

    // Merge existing task with new data
    // Keep original id and createdAt — only update what's provided
    const updatedTask = {
      ...tasks[taskIndex],              // Spread original task
      ...req.body,                      // Overwrite with new values
      id        : tasks[taskIndex].id,  // Never allow ID to change
      createdAt : tasks[taskIndex].createdAt, // Never change creation date
      updatedAt : new Date().toISOString(),   // Update timestamp
    };

    tasks[taskIndex] = updatedTask;
    writeTasks(tasks);

    res.status(200).json({
      success : true,
      message : 'Task updated successfully',
      data    : updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      success : false,
      message : 'Failed to update task',
    });
  }
};


// Add this BELOW the updateTask function in taskController.js

/**
 * DELETE /api/tasks/:id
 * Delete a task by ID
 */
const deleteTask = (req, res) => {
  try {
    const tasks     = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success : false,
        message : `Task with ID ${req.params.id} not found`,
      });
    }

    // Remove task from array
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    writeTasks(tasks);

    res.status(200).json({
      success : true,
      message : 'Task deleted successfully',
      data    : deletedTask,
    });
  } catch (error) {
    res.status(500).json({
      success : false,
      message : 'Failed to delete task',
    });
  }
};

// ── EXPORT ALL CONTROLLERS ────────────────────
module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};