// middleware/auth.js
const { admin } = require('../config/firebase');

/**
 * Middleware to authenticate user requests using Firebase Auth
 */
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized. No token provided.' 
      });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Add user information to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || '',
      role: decodedToken.role || 'student'
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid token.',
      error: error.message
    });
  }
};

module.exports = {
  authenticateUser
};