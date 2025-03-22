// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');
// require('dotenv').config();

// // Import firebase configuration
// const { db } = require('./config/firebase');

// const app = express();
// const server = http.createServer(app);

// // Configure Socket.io with proper CORS settings
// const io = socketIo(server, {
//   cors: {
//     origin: "*", // In production, specify your frontend URL
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
//   }
// });

// const PORT = process.env.PORT || 5000;

// // Import routes
// const studentRoutes = require('./routes/studentRoutes');
// const lecturerReservationRoutes = require('./routes/lecturerReservationRoutes');
// const studentReservationRoutes = require('./routes/studentReservationRoutes');


// // Middleware
// app.use(cors({
//   origin: "*", // In production, specify your frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));
// app.use(express.json());

// // Make io accessible to route handlers
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // Routes
// app.use('/api/students', studentRoutes);
// app.use('/api/lecturer', lecturerReservationRoutes)
// app.use('/api/studentsreservation', studentReservationRoutes);



// // Basic health check
// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'ok', message: 'Server is running' });
// });

// // Add a test endpoint for debugging
// app.get('/api/test', (req, res) => {
//   res.status(200).json({ 
//     status: 'ok', 
//     message: 'API is working!',
//     time: new Date().toISOString()
//   });
// });

// // Socket.io connection handling
// io.on('connection', (socket) => {
//   console.log('New client connected', socket.id);
  
//   // Listen for client joining a room
//   socket.on('joinRoom', (room) => {
//     socket.join(room);
//     console.log(`Client ${socket.id} joined room: ${room}`);
//   });
  
//   // Disconnect event
//   socket.on('disconnect', () => {
//     console.log('Client disconnected', socket.id);
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Server error:', err);
//   res.status(500).json({
//     success: false,
//     message: err.message || 'Server Error',
//     error: process.env.NODE_ENV === 'production' ? {} : err.stack
//   });
// });

// // Handle 404 errors
// app.use((req, res) => {
//   console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
//   res.status(404).json({
//     success: false,
//     message: `Route not found: ${req.method} ${req.originalUrl}`
//   });
// });

// // Start server
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Health check available at http://localhost:${PORT}/health`);
//   console.log(`Test endpoint available at http://localhost:${PORT}/api/test`);
// });

// // Handle server errors
// server.on('error', (error) => {
//   console.error('Server failed to start:', error);
//   if (error.code === 'EADDRINUSE') {
//     console.error(`Port ${PORT} is already in use. Please try a different port.`);
//   }
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (error) => {
//   console.error('Uncaught Exception:', error);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Promise Rejection:', reason);
// });


// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');
// require('dotenv').config();

// // Import firebase configuration
// const { db } = require('./config/firebase');

// const app = express();
// const server = http.createServer(app);

// // Configure Socket.io with proper CORS settings
// const io = socketIo(server, {
//   cors: {
//     origin: "*", // In production, specify your frontend URL
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
//   }
// });

// const PORT = process.env.PORT || 5000;

// // Import routes
// const studentRoutes = require('./routes/studentRoutes');
// const lecturerReservationRoutes = require('./routes/lecturerReservationRoutes');
// const studentReservationRoutes = require('./routes/studentReservationRoutes');


// // Middleware
// app.use(cors({
//   origin: "*", // In production, specify your frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));
// app.use(express.json());

// // Make io accessible to route handlers
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // Routes
// app.use('/api/students', studentRoutes);
// app.use('/api/lecturer', lecturerReservationRoutes);
// app.use('/api/studentsreservation', studentReservationRoutes);

// // Basic health check
// app.get('/health', (req, res) => {
//   res.status(200).json({ status: 'ok', message: 'Server is running' });
// });

// // Add a test endpoint for debugging
// app.get('/api/test', (req, res) => {
//   res.status(200).json({ 
//     status: 'ok', 
//     message: 'API is working!',
//     time: new Date().toISOString()
//   });
// });

// // Socket.io connection handling
// io.on('connection', (socket) => {
//   console.log('New client connected', socket.id);
  
//   // Listen for client joining a room
//   socket.on('joinRoom', async (room) => {
//     socket.join(room);
//     console.log(`Client ${socket.id} joined room: ${room}`);
    
//     // Send initial data when client joins lecturer-requests room
//     if (room === 'lecturer-requests') {
//       try {
//         const snapshot = await db.collection('IIT').doc('reservation').collection('lecturers').get();
        
//         if (!snapshot.empty) {
//           const lecturerRequests = [];
//           snapshot.forEach(doc => {
//             lecturerRequests.push({
//               id: doc.id,
//               ...doc.data()
//             });
//           });
          
//           // Categorize reservations by date
//           const today = new Date();
//           today.setHours(0, 0, 0, 0);
          
//           const todayReservations = [];
//           const upcomingReservations = [];
//           const previousReservations = [];
          
//           lecturerRequests.forEach(request => {
//             const reservationDate = new Date(request.date);
//             reservationDate.setHours(0, 0, 0, 0);
            
//             if (reservationDate.getTime() === today.getTime()) {
//               todayReservations.push(request);
//             } else if (reservationDate > today) {
//               upcomingReservations.push(request);
//             } else {
//               previousReservations.push(request);
//             }
//           });
          
//           // Send categorized initial data to just this client
//           socket.emit('initialLecturerData', {
//             today: todayReservations,
//             upcoming: upcomingReservations,
//             previous: previousReservations
//           });
//         } else {
//           socket.emit('initialLecturerData', {
//             today: [],
//             upcoming: [],
//             previous: []
//           });
//         }
//       } catch (error) {
//         console.error('Error sending initial data:', error);
//         socket.emit('error', { message: 'Failed to fetch initial data' });
//       }
//     }
//   });
  
//   // Disconnect event
//   socket.on('disconnect', () => {
//     console.log('Client disconnected', socket.id);
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Server error:', err);
//   res.status(500).json({
//     success: false,
//     message: err.message || 'Server Error',
//     error: process.env.NODE_ENV === 'production' ? {} : err.stack
//   });
// });

// // Handle 404 errors
// app.use((req, res) => {
//   console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
//   res.status(404).json({
//     success: false,
//     message: `Route not found: ${req.method} ${req.originalUrl}`
//   });
// });

// // Start server
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Health check available at http://localhost:${PORT}/health`);
//   console.log(`Test endpoint available at http://localhost:${PORT}/api/test`);
// });

// // Handle server errors
// server.on('error', (error) => {
//   console.error('Server failed to start:', error);
//   if (error.code === 'EADDRINUSE') {
//     console.error(`Port ${PORT} is already in use. Please try a different port.`);
//   }
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (error) => {
//   console.error('Uncaught Exception:', error);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Promise Rejection:', reason);
// });



const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// Import firebase configuration
const { db } = require('./config/firebase');

// Import CORS options
const corsOptions = require('./config/cors.js');

const app = express();
const server = http.createServer(app);

// Configure Socket.io with proper CORS settings
const io = socketIo(server, {
  cors: corsOptions
});

const PORT = process.env.PORT || 5000;

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const lecturerReservationRoutes = require('./routes/lecturerReservationRoutes');
const studentReservationRoutes = require('./routes/studentReservationRoutes');


// Middleware
app.use(cors({
  origin: "*", // In production, specify your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Make io accessible to route handlers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/lecturer', lecturerReservationRoutes);
app.use('/api/studentsreservation', studentReservationRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Add a test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'API is working!',
    time: new Date().toISOString()
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);
  
  // Listen for client joining a room
  socket.on('joinRoom', async (room) => {
    socket.join(room);
    console.log(`Client ${socket.id} joined room: ${room}`);
    
    // Send initial data when client joins lecturer-requests room
    if (room === 'lecturer-requests') {
      try {
        const snapshot = await db.collection('IIT').doc('reservation').collection('lecturers').get();
        
        if (!snapshot.empty) {
          const lecturerRequests = [];
          snapshot.forEach(doc => {
            lecturerRequests.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          // Categorize reservations by date
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const todayReservations = [];
          const upcomingReservations = [];
          const previousReservations = [];
          
          lecturerRequests.forEach(request => {
            const reservationDate = new Date(request.date);
            reservationDate.setHours(0, 0, 0, 0);
            
            if (reservationDate.getTime() === today.getTime()) {
              todayReservations.push(request);
            } else if (reservationDate > today) {
              upcomingReservations.push(request);
            } else {
              previousReservations.push(request);
            }
          });
          
          // Send categorized initial data to just this client
          socket.emit('initialLecturerData', {
            today: todayReservations,
            upcoming: upcomingReservations,
            previous: previousReservations
          });
        } else {
          socket.emit('initialLecturerData', {
            today: [],
            upcoming: [],
            previous: []
          });
        }
      } catch (error) {
        console.error('Error sending initial data:', error);
        socket.emit('error', { message: 'Failed to fetch initial data' });
      }
    }
  });
  
  // Disconnect event
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Handle 404 errors
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`Test endpoint available at http://localhost:${PORT}/api/test`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server failed to start:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
});