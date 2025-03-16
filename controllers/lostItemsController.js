// controllers/lostItemsController.js
const { db } = require('../config/firebase');

/**
 * Submit a new lost item
 */
const submitLostItem = async (req, res) => {
  try {
    const { category, name, location, description } = req.body;
    const userId = req.user.uid;
    const userName = req.user.name || 'Anonymous';
    
    // Data validation
    if (!category || !name || !location) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Create a new lost item object
    const newItem = {
      category,
      name, 
      location,
      description: description || '',
      userId,
      userName,
      status: 'Lost',
      dateReported: new Date().toISOString(),
      dateFormatted: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    };

    // Add to Firestore
    const lostItemsRef = db.collection('IIT').doc('lost-items').collection('items');
    const docRef = await lostItemsRef.add(newItem);
    
    return res.status(201).json({ 
      success: true,
      message: 'Lost item reported successfully',
      data: { id: docRef.id, ...newItem }
    });
  } catch (error) {
    console.error('Error submitting lost item:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to submit lost item',
      error: error.message
    });
  }
};

/**
 * Get all lost items for the current user
 */
const getMyLostItems = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    // Query Firestore
    const lostItemsRef = db.collection('IIT').doc('lost-items').collection('items');
    const snapshot = await lostItemsRef.where('userId', '==', userId).get();
    
    const items = [];
    snapshot.forEach(doc => {
      items.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.status(200).json({ 
      success: true,
      message: 'Retrieved lost items successfully',
      data: items
    });
  } catch (error) {
    console.error('Error fetching lost items:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch lost items',
      error: error.message
    });
  }
};

/**
 * Get all found items
 */
const getFoundItems = async (req, res) => {
  try {
    // Query Firestore
    const foundItemsRef = db.collection('IIT').doc('found-items').collection('items');
    const snapshot = await foundItemsRef.get();
    
    const items = [];
    snapshot.forEach(doc => {
      items.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.status(200).json({ 
      success: true,
      message: 'Retrieved found items successfully',
      data: items
    });
  } catch (error) {
    console.error('Error fetching found items:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch found items',
      error: error.message
    });
  }
};

/**
 * Mark a lost item as found
 */
const markAsFound = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.uid;
    
    // Reference to the lost item document
    const lostItemRef = db.collection('IIT').doc('lost-items').collection('items').doc(itemId);
    const doc = await lostItemRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }
    
    const itemData = doc.data();
    
    // Verify ownership
    if (itemData.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this item' 
      });
    }
    
    // Update status in lost-items collection
    await lostItemRef.update({
      status: 'Found',
      dateFound: new Date().toISOString(),
      dateFoundFormatted: new Date().toISOString().split('T')[0]
    });
    
    // Add to found-items collection
    const foundItemsRef = db.collection('IIT').doc('found-items').collection('items');
    await foundItemsRef.add({
      ...itemData,
      status: 'Found',
      dateFound: new Date().toISOString(),
      dateFoundFormatted: new Date().toISOString().split('T')[0]
    });
    
    return res.status(200).json({ 
      success: true,
      message: 'Item marked as found successfully',
      data: { id: itemId }
    });
  } catch (error) {
    console.error('Error marking item as found:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to mark item as found',
      error: error.message
    });
  }
};

/**
 * Remove a lost item
 */
const removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.uid;
    
    // Reference to the item document
    const itemRef = db.collection('IIT').doc('lost-items').collection('items').doc(itemId);
    const doc = await itemRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found' 
      });
    }
    
    const itemData = doc.data();
    
    // Verify ownership
    if (itemData.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this item' 
      });
    }
    
    // Delete the item
    await itemRef.delete();
    
    return res.status(200).json({ 
      success: true,
      message: 'Item removed successfully',
      data: { id: itemId }
    });
  } catch (error) {
    console.error('Error removing item:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to remove item',
      error: error.message
    });
  }
};

module.exports = {
  submitLostItem,
  getMyLostItems,
  getFoundItems,
  markAsFound,
  removeItem
};