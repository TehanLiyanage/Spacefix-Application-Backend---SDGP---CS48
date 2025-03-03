// src/config/firebase.js
const admin = require('firebase-admin');

// Path to your service account key JSON file
const serviceAccount = require('../keys/service-account-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get Firestore instance
const db = admin.firestore();

module.exports = { admin, db };