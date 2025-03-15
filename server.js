const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// Import firebase configuration
const { db } = require('./config/firebase');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // In production, specify your frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Make io accessible to route handlers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/lecturers', lecturerRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);
  
  // Listen for client joining a room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`Client ${socket.id} joined room: ${room}`);
  });
  
  // Disconnect event
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
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
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});