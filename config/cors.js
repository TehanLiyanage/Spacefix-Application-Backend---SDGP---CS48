// src/config/cors.js
const corsOptions = {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'https://www.spacefix.lk',
      'https://spacefix.lk',
      'https://spacefix-application-backend-sdgp-cs48.onrender.com'
      // Add your production domains here when deploying
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    credentials: true,
    maxAge: 86400 // 24 hours
  };
  
  module.exports = corsOptions;