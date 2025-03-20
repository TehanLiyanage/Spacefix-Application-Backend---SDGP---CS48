// const express = require('express');
// const router = express.Router();
// const { getTestStudents } = require('../controllers/studentController');

// // Test route to fetch students
// router.get('/test', getTestStudents);

// module.exports = router;

// Create a new file: routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const { updateStudent, getAllStudents, getStudentById } = require('../controllers/studentController');

router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);

module.exports = router;