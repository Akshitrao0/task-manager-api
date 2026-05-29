// ============================================
// taskRoutes.js — API Route Definitions
// Maps HTTP methods + URLs to controllers
// ============================================

const express        = require('express');
const router         = express.Router();
const taskController = require('../controllers/taskController');
const validateTask   = require('../middleware/validateTask');

// ── ROUTES ────────────────────────────────────
// GET    /api/tasks          → Get all tasks
// GET    /api/tasks/:id      → Get single task
// POST   /api/tasks          → Create new task
// PUT    /api/tasks/:id      → Update task
// DELETE /api/tasks/:id      → Delete task

router.get('/',     taskController.getAllTasks);
router.get('/:id',  taskController.getTaskById);
router.post('/',    validateTask, taskController.createTask);
router.put('/:id',  validateTask, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;