const express = require('express');
const router = express.Router();
const lecturerReservationController = require('../controllers/lecturerReservationController');

// Get all lecturer requests with date categorization
router.get('/requests', lecturerReservationController.getAllLecturerRequests);

// Get lecturer requests by status with date categorization
router.get('/requests/status/:status', lecturerReservationController.getLecturerRequestsByStatus);

// Get lecturer requests by date range
router.get('/requests/daterange', lecturerReservationController.getLecturerRequestsByDateRange);

// Get lecturer requests by allocated room
router.get('/requests/room/:room', lecturerReservationController.getLecturerRequestsByRoom);

// Get a single lecturer request by ID
router.get('/requests/:id', lecturerReservationController.getLecturerRequestById);

// Create a new lecturer reservation request
router.post('/requests', lecturerReservationController.createLecturerRequest);

// Update lecturer request status
router.put('/requests/:id/status', lecturerReservationController.updateLecturerRequestStatus);

// Update lecturer request details
router.put('/requests/:id', lecturerReservationController.updateLecturerRequest);

// Delete a lecturer reservation
router.delete('/requests/:id', lecturerReservationController.deleteLecturerReservation);

module.exports = router;