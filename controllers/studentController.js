const { db } = require('../config/firebase');

/**
 * @desc    Get all students
 * @route   GET /api/students/test
 * @access  Public
 */
const getTestStudents = async (req, res) => {
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
};

module.exports = {
  getTestStudents
};