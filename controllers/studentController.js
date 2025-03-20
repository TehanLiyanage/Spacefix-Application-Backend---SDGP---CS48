// const { db } = require('../config/firebase');

// /**
//  * @desc    Get all students
//  * @route   GET /api/students/test
//  * @access  Public
//  */
// const getTestStudents = async (req, res) => {
//   try {
//     // Access the exact path you showed in the screenshot
//     const studentsRef = db.collection('IIT').doc('Users').collection('students');
//     const snapshot = await studentsRef.get();
    
//     if (snapshot.empty) {
//       return res.status(200).json({
//         success: true,
//         message: 'Connected to Firebase successfully, but no student documents found',
//         data: []
//       });
//     }
    
//     // Convert the data to a more manageable format
//     const students = [];
//     snapshot.forEach(doc => {
//       students.push({
//         id: doc.id,
//         ...doc.data()
//       });
//     });
    
//     return res.status(200).json({
//       success: true,
//       message: 'Successfully connected to Firebase and retrieved students',
//       count: students.length,
//       data: students
//     });
//   } catch (error) {
//     console.error('Error connecting to Firebase:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to connect to Firebase or retrieve students', 
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   getTestStudents
// };

// Create a new file: controllers/studentController.js
const { db } = require('../config/firebase');

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const studentsRef = db.collection('IIT').doc('Users').collection('students');
    const snapshot = await studentsRef.get();
    
    if (snapshot.empty) {
      return res.status(200).json({ students: [] });
    }
    
    const students = [];
    snapshot.forEach(doc => {
      students.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json({ students });
  } catch (error) {
    console.error('Error getting students:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students', error: error.message });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;
    const studentRef = db.collection('IIT').doc('Users').collection('students').doc(studentId);
    const doc = await studentRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    res.status(200).json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error getting student:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student', error: error.message });
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const updateData = req.body;
    
    // Validate update data
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: 'No update data provided' });
    }
    
    // Restrict which fields can be updated
    const allowedFields = ['displayName', 'email', 'photoURL'];
    const filteredData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});
    
    if (Object.keys(filteredData).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }
    
    // Update the document
    const studentRef = db.collection('IIT').doc('Users').collection('students').doc(studentId);
    await studentRef.update(filteredData);
    
    // Notify connected clients about the update
    if (req.io) {
      req.io.to('student-updates').emit('studentUpdated', {
        id: studentId,
        ...filteredData
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Student updated successfully',
      updatedFields: filteredData
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ success: false, message: 'Failed to update student', error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudent
};