const express = require('express');
const router = express.Router();
const { getTestStudents } = require('../controllers/studentController');

// Test route to fetch students
router.get('/test', getTestStudents);

module.exports = router;
