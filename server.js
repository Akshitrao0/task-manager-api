// ============================================
// server.js — Entry point of the application
// This file starts the HTTP server
// ============================================

// Load environment variables first
require('dotenv').config();

const app  = require('./src/app');

// Use environment variable or fallback to 3000
const PORT = process.env.PORT || 3000;

// Start the server and listen for connections
app.listen(PORT, () => {
  console.log('================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log('================================');
});

// Export for testing purposes
module.exports = app;