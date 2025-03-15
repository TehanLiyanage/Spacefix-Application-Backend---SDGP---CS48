// routes/lecturerRoutes.js
const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');

// Get all lecturer requests
router.get('/requests', lecturerController.getAllLecturerRequests);

// Get lecturer requests by status
router.get('/requests/status/:status', lecturerController.getLecturerRequestsByStatus);

// Get a single lecturer request by ID
router.get('/requests/:id', lecturerController.getLecturerRequestById);

module.exports = router;