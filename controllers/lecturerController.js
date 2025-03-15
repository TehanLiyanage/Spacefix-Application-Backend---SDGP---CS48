// controllers/lecturerController.js
const { db } = require('../config/firebase');

// Get all lecturer requests
exports.getAllLecturerRequests = async (req, res) => {
  try {
    const snapshot = await db.collection('IIT').doc('reservation').collection('lecturers').get();
    
    if (snapshot.empty) {
      return res.json([]);
    }
    
    const lecturerRequests = [];
    snapshot.forEach(doc => {
      lecturerRequests.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(lecturerRequests);
  } catch (error) {
    console.error('Error getting lecturer requests:', error);
    res.status(500).json({ error: 'Failed to fetch lecturer requests' });
  }
};

// Get lecturer requests by status
exports.getLecturerRequestsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    const snapshot = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .where('status', '==', status)
      .get();
    
    if (snapshot.empty) {
      return res.json([]);
    }
    
    const lecturerRequests = [];
    snapshot.forEach(doc => {
      lecturerRequests.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(lecturerRequests);
  } catch (error) {
    console.error(`Error getting ${req.params.status} lecturer requests:`, error);
    res.status(500).json({ error: `Failed to fetch ${req.params.status} lecturer requests` });
  }
};

// Get a single lecturer request by ID
exports.getLecturerRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const docRef = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .get();
    
    if (!docRef.exists) {
      return res.status(404).json({ error: 'Lecturer request not found' });
    }
    
    res.json({
      id: docRef.id,
      ...docRef.data()
    });
  } catch (error) {
    console.error('Error getting lecturer request:', error);
    res.status(500).json({ error: 'Failed to fetch lecturer request' });
  }
};