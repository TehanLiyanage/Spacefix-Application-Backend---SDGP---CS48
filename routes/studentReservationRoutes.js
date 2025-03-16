// routes/studentReservationRoutes.js
const express = require('express');
const router = express.Router();
const studentReservationController = require('../controllers/studentReservationController');

// Get all reservations (divided into current/future and past)
router.get('/reservations', studentReservationController.getAllReservations);

// Get today's reservations (must come before :id route)
router.get('/reservations/today', studentReservationController.getTodayReservations);

// Get reservation by ID
router.get('/reservations/:id', studentReservationController.getReservationById);

// Delete a reservation
router.delete('/reservations/:id', studentReservationController.deleteReservation);

module.exports = router;