// Add this at the top of your server.js file, right after require('dotenv').config();
const express = require('express');
require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('./keys/service-account-key.json');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Simple route to test Firebase connection and get students 
// /test-students - api endpoint

app.get('/test-students', async (req, res) => {
  try {
    // Access the exact path you showed in the screenshot
    const studentsRef = db.collection('IIT').doc('Users').collection('students');
    const snapshot = await studentsRef.get();
    
    if (snapshot.empty) {
      return res.status(200).json({
        success: true,
        message: 'Connected to Firebase successfully, but no student documents found',
        data: []
      });
    }
    
    // Convert the data to a more manageable format
    const students = [];
    snapshot.forEach(doc => {
      students.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.status(200).json({
      success: true,
      message: 'Successfully connected to Firebase and retrieved students',
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Error connecting to Firebase:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to connect to Firebase or retrieve students', 
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});