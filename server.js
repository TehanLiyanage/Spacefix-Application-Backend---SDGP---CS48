const express = require('express');
require('dotenv').config();
// Import firebase configuration
const { db } = require('./config/firebase');

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/lecturers', lecturerRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});