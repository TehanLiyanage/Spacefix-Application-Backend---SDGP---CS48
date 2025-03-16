const express = require('express');
const router = express.Router();
const { getTestStudents } = require('../controllers/studentController');
const lostItemsController = require('../controllers/lostItemsController');
const { authenticateUser } = require('../middleware/auth'); // Import the auth middleware

// Test route to fetch students (keep existing route)
router.get('/test', getTestStudents);

// Lost Items routes - all protected by authentication
// Group all lost items routes under /lost-items path
router.use('/lost-items', authenticateUser); // Apply auth middleware to all lost items routes

// Submit a new lost item
router.post('/lost-items', lostItemsController.submitLostItem);

// Get all lost items for the current user
router.get('/lost-items/my-items', lostItemsController.getMyLostItems);

// Get all found items
router.get('/lost-items/found-items', lostItemsController.getFoundItems);

// Mark a lost item as found
router.put('/lost-items/:itemId/mark-as-found', lostItemsController.markAsFound);

// Remove a lost item
router.delete('/lost-items/:itemId', lostItemsController.removeItem);

module.exports = router;