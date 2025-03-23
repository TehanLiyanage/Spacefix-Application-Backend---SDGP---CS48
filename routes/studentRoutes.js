
const express = require('express');
const router = express.Router();
const { updateStudent, getAllStudents, getStudentById } = require('../controllers/studentController');

router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);

module.exports = router;