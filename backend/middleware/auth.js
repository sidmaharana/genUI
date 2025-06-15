// middleware/auth.js
const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ 
      error: 'Invalid token.' 
    });
  }
};

const checkUserRole = (roles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.uid;
      const userDoc = await admin.firestore()
        .collection('users')
        .doc(userId)
        .get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userRole = userDoc.data().role || 'user';
      
      if (!roles.includes(userRole)) {
        return res.status(403).json({ 
          error: 'Access denied. Insufficient permissions.' 
        });
      }

      req.userRole = userRole;
      next();
    } catch (error) {
      console.error('Role check failed:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};

module.exports = { verifyToken, checkUserRole };