// routes/auth.js
const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Initialize Firebase Admin SDK
const serviceAccount = require('../config/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Create user profile
router.post('/profile', verifyToken, async (req, res) => {
  try {
    const { displayName, email, photoURL } = req.body;
    const userId = req.user.uid;

    const userProfile = {
      uid: userId,
      displayName,
      email,
      photoURL,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      projects: [],
      completedChapters: 0,
      totalPoints: 0
    };

    await db.collection('users').doc(userId).set(userProfile, { merge: true });
    res.json({ success: true, user: userProfile });
  } catch (error) {
    console.error('Profile creation error:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userDoc.data());
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;