const { db } = require('../config/firebase');

// Get all lecturer reservation requests
exports.getAllLecturerRequests = async (req, res) => {
  try {
    const snapshot = await db.collection('IIT').doc('reservation').collection('lecturers').get();
    
    if (snapshot.empty) {
      return res.json({
        today: [],
        upcoming: [],
        previous: []
      });
    }
    
    const lecturerRequests = [];
    snapshot.forEach(doc => {
      lecturerRequests.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Separate reservations based on date (today, upcoming, previous)
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
    
    res.json({
      today: todayReservations,
      upcoming: upcomingReservations,
      previous: previousReservations
    });
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
      return res.json({
        today: [],
        upcoming: [],
        previous: []
      });
    }
    
    const lecturerRequests = [];
    snapshot.forEach(doc => {
      lecturerRequests.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Separate reservations based on date (today, upcoming, previous)
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
    
    res.json({
      today: todayReservations,
      upcoming: upcomingReservations,
      previous: previousReservations
    });
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

// Create a new lecturer reservation request
exports.createLecturerRequest = async (req, res) => {
  try {
    const { 
      lecturerId, 
      lecturerName, 
      date, 
      startTime, 
      endTime, 
      purpose, 
      department,
      email,
      phone, 
      additionalInfo 
    } = req.body;
    
    // Validate required fields
    if (!lecturerId || !lecturerName || !date || !startTime || !endTime || !purpose || !department) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create new document with generated timestamp
    const newRequest = {
      lecturerId,
      lecturerName,
      date,
      startTime,
      endTime,
      purpose,
      department,
      email: email || '',
      phone: phone || '',
      additionalInfo: additionalInfo || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Add to Firebase
    const docRef = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .add(newRequest);
    
    // Add ID to the document
    const createdRequest = {
      id: docRef.id,
      ...newRequest
    };
    
    // Emit WebSocket event
    req.io.to('lecturer-requests').emit('lecturerRequestUpdate', {
      type: 'created',
      request: createdRequest
    });
    
    res.status(201).json({
      success: true,
      message: 'Reservation request created successfully',
      data: createdRequest
    });
  } catch (error) {
    console.error('Error creating lecturer request:', error);
    res.status(500).json({ error: 'Failed to create reservation request' });
  }
};

// Update lecturer request status
exports.updateLecturerRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvalMessage, allocatedRoom } = req.body;
    
    // Create update object
    const updateData = { status };
    
    // If status is 'approved', add approval message and allocated room
    if (status === 'approved') {
      if (!allocatedRoom) {
        return res.status(400).json({ error: 'Room allocation is required for approval' });
      }
      
      updateData.approvalMessage = approvalMessage || '';
      updateData.allocatedRoom = allocatedRoom;
      updateData.approvedAt = new Date().toISOString();
    } else if (status === 'rejected') {
      updateData.rejectionReason = req.body.rejectionReason || '';
      updateData.rejectedAt = new Date().toISOString();
    }
    
    // Update the document in Firebase
    await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .update(updateData);
    
    // Get the updated document
    const updatedDoc = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .get();
    
    const updatedRequest = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };
    
    // Emit a WebSocket event to notify all clients
    req.io.to('lecturer-requests').emit('lecturerRequestUpdate', {
      type: 'statusChange',
      requestId: id,
      status,
      request: updatedRequest
    });
    
    res.json({ 
      success: true, 
      message: `Request ${status} successfully`,
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error updating lecturer request status:', error);
    res.status(500).json({ error: 'Failed to update request status' });
  }
};

// Update lecturer request details
exports.updateLecturerRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      date, 
      startTime, 
      endTime, 
      purpose, 
      additionalInfo 
    } = req.body;
    
    // Check if the document exists
    const docRef = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .get();
    
    if (!docRef.exists) {
      return res.status(404).json({ error: 'Lecturer reservation not found' });
    }
    
    // Create update object with only provided fields
    const updateData = {};
    if (date) updateData.date = date;
    if (startTime) updateData.startTime = startTime;
    if (endTime) updateData.endTime = endTime;
    if (purpose) updateData.purpose = purpose;
    if (additionalInfo !== undefined) updateData.additionalInfo = additionalInfo;
    
    // Add last updated timestamp
    updateData.updatedAt = new Date().toISOString();
    
    // Update the document in Firebase
    await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .update(updateData);
    
    // Get the updated document
    const updatedDoc = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .get();
    
    const updatedRequest = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };
    
    // Emit a WebSocket event to notify all clients
    req.io.to('lecturer-requests').emit('lecturerRequestUpdate', {
      type: 'updated',
      requestId: id,
      request: updatedRequest
    });
    
    res.json({ 
      success: true, 
      message: 'Request updated successfully',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error updating lecturer request:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
};

// Delete a lecturer reservation
exports.deleteLecturerReservation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the document exists
    const docRef = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .get();
    
    if (!docRef.exists) {
      return res.status(404).json({ error: 'Lecturer reservation not found' });
    }
    
    // Get the document data before deletion (for WebSocket event)
    const deletedRequest = {
      id: docRef.id,
      ...docRef.data()
    };
    
    // Delete the document in Firebase
    await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .doc(id)
      .delete();
    
    // Emit a WebSocket event to notify all clients
    req.io.to('lecturer-requests').emit('lecturerRequestUpdate', {
      type: 'deleted',
      requestId: id,
      request: deletedRequest
    });
    
    res.json({ 
      success: true, 
      message: 'Reservation deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting lecturer reservation:', error);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
};

// Get lecturer reservations by date range
exports.getLecturerRequestsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    // Parse dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    startDateObj.setHours(0, 0, 0, 0);
    endDateObj.setHours(23, 59, 59, 999);
    
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    
    // Get all documents and filter by date (Firestore doesn't support range queries on multiple fields)
    const snapshot = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .get();
    
    if (snapshot.empty) {
      return res.json([]);
    }
    
    const lecturerRequests = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      const reservationDate = new Date(data.date);
      
      if (reservationDate >= startDateObj && reservationDate <= endDateObj) {
        lecturerRequests.push({
          id: doc.id,
          ...data
        });
      }
    });
    
    res.json(lecturerRequests);
  } catch (error) {
    console.error('Error getting lecturer requests by date range:', error);
    res.status(500).json({ error: 'Failed to fetch lecturer requests by date range' });
  }
};

// Get lecturer reservations by room
exports.getLecturerRequestsByRoom = async (req, res) => {
  try {
    const { room } = req.params;
    
    const snapshot = await db.collection('IIT')
      .doc('reservation')
      .collection('lecturers')
      .where('allocatedRoom', '==', room)
      .where('status', '==', 'approved')
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
    console.error(`Error getting lecturer requests for room ${req.params.room}:`, error);
    res.status(500).json({ error: `Failed to fetch lecturer requests for room ${req.params.room}` });
  }
};