const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');
const { getDb } = require('../db');
const firebaseService = require('../services/firebase');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_cookie_key_9824';

async function resolveUserFromToken(token) {
  if (!token) return null;

  // 1. Try verifying as Firebase ID Token first if Firebase is initialized
  if (firebaseService.isInitialized()) {
    try {
      const decodedFirebase = await firebaseService.verifyFirebaseToken(token);
      if (decodedFirebase && (decodedFirebase.uid || decodedFirebase.email)) {
        const userEmail = (decodedFirebase.email || `${decodedFirebase.uid}@firebase.user`).toLowerCase();
        const db = await getDb();
        
        let localUser = await db.get('SELECT * FROM users WHERE email = ?', [userEmail]);
        if (!localUser) {
          const insertResult = await db.run(
            'INSERT INTO users (email, password_hash) VALUES (?, ?)',
            [userEmail, 'FIREBASE_AUTH_PROVIDER']
          );
          localUser = { id: insertResult.lastID, email: userEmail };
        }

        // Sync user profile to Firestore
        firebaseService.syncUserToFirestore(decodedFirebase.uid, {
          email: userEmail,
          displayName: decodedFirebase.name || userEmail.split('@')[0],
          photoURL: decodedFirebase.picture || null,
          localId: localUser.id
        });

        return {
          id: localUser.id,
          firebaseUid: decodedFirebase.uid,
          email: userEmail,
          username: decodedFirebase.name || userEmail.split('@')[0],
          picture: decodedFirebase.picture || null,
          isFirebase: true
        };
      }
    } catch (firebaseErr) {
      // Not a Firebase token or expired, continue to fallback JWT verification
    }
  }

  // 2. Fallback to standard local JWT
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    return {
      id: verified.id,
      email: verified.email,
      username: verified.username || (verified.email ? verified.email.split('@')[0] : 'User'),
      isFirebase: false
    };
  } catch (jwtErr) {
    return null;
  }
}

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const token = bearerToken || req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No session token provided.' });
  }

  try {
    const user = await resolveUserFromToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Access denied. Invalid session token.' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth verification error:', err);
    res.status(401).json({ error: 'Access denied. Authentication failure.' });
  }
}

async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const token = bearerToken || req.cookies.token;

  if (!token) {
    return next();
  }

  try {
    const user = await resolveUserFromToken(token);
    if (user) {
      req.user = user;
    }
  } catch (err) {
    // Ignore error for optional authentication
  }
  next();
}

module.exports = { requireAuth, optionalAuth, JWT_SECRET, resolveUserFromToken };
