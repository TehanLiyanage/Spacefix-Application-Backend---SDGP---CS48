// controllers/studentReservationController.js
const { db } = require('../config/firebase');

// Get all student reservations
exports.getAllReservations = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const studentsRef = db.collection('IIT').doc('reservation').collection('students');
    const snapshot = await studentsRef.get();
    
    if (snapshot.empty) {
      return res.status(200).json({
        success: true,
        message: 'No reservations found',
        currentAndFutureReservations: [],
        pastReservations: []
      });
    }
    
    const currentAndFutureReservations = [];
    const pastReservations = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const reservation = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
      };
      
      // Split reservations into current/future and past
      if (data.date >= today) {
        currentAndFutureReservations.push(reservation);
      } else {
        pastReservations.push(reservation);
      }
    });
    
    // Sort reservations by date and timeSlot
    const sortByDateAndTime = (a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.timeSlot.localeCompare(b.timeSlot);
    };
    
    currentAndFutureReservations.sort(sortByDateAndTime);
    pastReservations.sort(sortByDateAndTime);
    
    res.status(200).json({
      success: true,
      message: 'Reservations retrieved successfully',
      currentAndFutureReservations,
      pastReservations
    });
  } catch (error) {
    console.error('Error getting reservations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve reservations',
      error: error.message
    });
  }
};

// Get reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const docRef = db.collection('IIT').doc('reservation').collection('students').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: `Reservation with ID ${id} not found`
      });
    }
    
    const data = doc.data();
    const reservation = {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? data.createdAt.toDate() : null,
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
    };
    
    res.status(200).json({
      success: true,
      message: 'Reservation retrieved successfully',
      reservation
    });
  } catch (error) {
    console.error('Error getting reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve reservation',
      error: error.message
    });
  }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const docRef = db.collection('IIT').doc('reservation').collection('students').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: `Reservation with ID ${id} not found`
      });
    }
    
    // Store document data before deletion for notification
    const deletedData = doc.data();
    
    await docRef.delete();
    
    // Notify connected clients about the deletion
    if (req.io) {
      req.io.emit('reservationUpdated', {
        type: 'deleted',
        id,
        ...deletedData
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Reservation deleted successfully',
      id
    });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete reservation',
      error: error.message
    });
  }
};

// Get today's reservations
exports.getTodayReservations = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const studentsRef = db.collection('IIT').doc('reservation').collection('students');
    const snapshot = await studentsRef.where('date', '==', today).get();
    
    if (snapshot.empty) {
      return res.status(200).json({
        success: true,
        message: 'No reservations found for today',
        reservations: []
      });
    }
    
    const reservations = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      reservations.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
      });
    });
    
    // Sort by timeSlot
    reservations.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
    
    res.status(200).json({
      success: true,
      message: 'Today\'s reservations retrieved successfully',
      reservations
    });
  } catch (error) {
    console.error('Error getting today\'s reservations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve today\'s reservations',
      error: error.message
    });
  }
};