// ============================================
// validateTask.js — Request Validation
// Runs BEFORE controller to check input data
// ============================================

const validateTask = (req, res, next) => {

  const { title, priority, status } = req.body;

  const errors = [];

  // ── VALIDATION RULES ─────────────────────

  // Title is required and must be a string
  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push('Title is required and must be a non-empty string');
  }

  // Title max length
  if (title && title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }

  // Priority must be one of the allowed values
  const allowedPriorities = ['low', 'medium', 'high'];
  if (priority && !allowedPriorities.includes(priority)) {
    errors.push(`Priority must be one of: ${allowedPriorities.join(', ')}`);
  }

  // Status must be one of the allowed values
  const allowedStatuses = ['todo', 'in-progress', 'completed'];
  if (status && !allowedStatuses.includes(status)) {
    errors.push(`Status must be one of: ${allowedStatuses.join(', ')}`);
  }

  // ── RETURN ERRORS IF ANY ──────────────────
  if (errors.length > 0) {
    return res.status(400).json({
      success : false,
      message : 'Validation failed',
      errors  : errors,
    });
  }

  // ── ALL GOOD — PASS TO CONTROLLER ─────────
  next();
};

module.exports = validateTask;