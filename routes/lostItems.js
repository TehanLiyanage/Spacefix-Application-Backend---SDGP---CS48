const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// POST: Report Lost Item
router.post('/lostitems', async (req, res) => {
  try {
    const { category, itemName, location, description, userEmail } = req.body;

    const newItem = {
      category,
      itemName,
      location,
      description,
      status: 'Lost',
      userEmail, // Changed from userId to userEmail
      date: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
    };

    const docRef = await db.collection('IIT').doc('LostItems').collection('Items').add(newItem);
    res.status(201).send({ id: docRef.id, ...newItem });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET: My Lost Items by User Email
router.get('/lostitems/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;

    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    const snapshot = await db.collection('IIT').doc('LostItems').collection('Items')
      .where('userEmail', '==', userEmail)
      .get();

    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.send(items);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// PATCH: Mark Item as Found (Status Updated Only)
router.patch('/lostitems/found/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const itemRef = db.collection('IIT').doc('LostItems').collection('Items').doc(id);
    await itemRef.update({ status: 'Found' });

    res.send({ message: 'Item marked as found.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// DELETE: Remove Lost Item
router.delete('/lostitems/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('IIT').doc('LostItems').collection('Items').doc(id).delete();
    res.send({ message: 'Item deleted successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET: Found Items (status === 'Found' from LostItems Collection)
router.get('/founditems', async (req, res) => {
  try {
    const snapshot = await db.collection('IIT').doc('LostItems').collection('Items')
      .where('status', '==', 'Found')
      .get();

    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.send(items);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
