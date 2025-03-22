const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');

// Get all classrooms
router.get('/', classroomController.getAllClassrooms);

// Filter classrooms
router.get('/filter', classroomController.filterClassrooms);

// Get classroom by ID
router.get('/:id', classroomController.getClassroomById);

// Get route between two classrooms
router.get('/route/:from/:to', classroomController.getRoute);

// Initialize default classrooms (for development)
router.post('/initialize', classroomController.initializeClassrooms);

module.exports = router;