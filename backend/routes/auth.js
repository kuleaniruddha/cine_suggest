const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db');
const { optionalAuth, JWT_SECRET } = require('../middleware/auth');
const firebaseService = require('../services/firebase');

const router = express.Router();

// POST /api/auth/firebase-login
router.post('/firebase-login', async (req, res) => {
  const { idToken, user: clientUser } = req.body;

  if (!idToken && !clientUser) {
    return res.status(400).json({ error: 'Firebase authentication token or user required.' });
  }

  try {
    let uid = clientUser?.uid;
    let email = clientUser?.email;
    let displayName = clientUser?.displayName;
    let photoURL = clientUser?.photoURL;

    // Verify ID token if present and firebase-admin is initialized
    if (idToken && firebaseService.isInitialized()) {
      try {
        const decoded = await firebaseService.verifyFirebaseToken(idToken);
        uid = decoded.uid;
        email = decoded.email || email;
        displayName = decoded.name || displayName;
        photoURL = decoded.picture || photoURL;
      } catch (tokenErr) {
        console.warn('Firebase token verification warning:', tokenErr.message);
      }
    }

    if (!email && !uid) {
      return res.status(400).json({ error: 'Unable to resolve Firebase user details.' });
    }

    const effectiveEmail = (email || `${uid}@firebase.user`).toLowerCase();
    const effectiveUsername = displayName || effectiveEmail.split('@')[0];

    const db = await getDb();
    let user = await db.get('SELECT * FROM users WHERE email = ?', [effectiveEmail]);

    if (!user) {
      const result = await db.run(
        'INSERT INTO users (email, password_hash) VALUES (?, ?)',
        [effectiveEmail, 'FIREBASE_AUTH_PROVIDER']
      );
      user = {
        id: result.lastID,
        email: effectiveEmail,
        created_at: new Date().toISOString()
      };
    }

    // Sync to Firestore
    if (uid) {
      firebaseService.syncUserToFirestore(uid, {
        email: effectiveEmail,
        displayName: effectiveUsername,
        photoURL: photoURL || null,
        localId: user.id
      });
    }

    // Generate session JWT for cookie / seamless token usage
    const token = jwt.sign(
      { id: user.id, firebaseUid: uid, email: effectiveEmail, username: effectiveUsername },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      token,
      user: {
        id: user.id,
        firebaseUid: uid,
        email: effectiveEmail,
        username: effectiveUsername,
        photoURL: photoURL || null,
        created_at: user.created_at,
        isFirebase: true
      }
    });
  } catch (err) {
    console.error('Firebase login error:', err);
    res.status(500).json({ error: 'Firebase authentication failed: ' + err.message });
  }
});

// GET /api/auth/firebase-config
router.get('/firebase-config', (req, res) => {
  res.json({
    projectId: 'cine-suggest-7787c',
    authDomain: 'cine-suggest-7787c.firebaseapp.com',
    storageBucket: 'cine-suggest-7787c.appspot.com',
    isInitialized: firebaseService.isInitialized()
  });
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const db = await getDb();
    
    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const result = await db.run(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email.toLowerCase(), passwordHash]
    );

    const userId = result.lastID;
    const userDisplayName = username || email.split('@')[0];
    
    // Generate JWT
    const token = jwt.sign(
      { id: userId, email: email.toLowerCase(), username: userDisplayName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      token,
      user: {
        id: userId,
        email: email.toLowerCase(),
        username: userDisplayName
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Failed to register user.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const db = await getDb();
    
    // Fetch user
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Verify password (check if normal hash or firebase provider)
    if (user.password_hash === 'FIREBASE_AUTH_PROVIDER') {
      return res.status(400).json({ error: 'This account was created with Firebase / Google. Please sign in with Firebase / Google.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.email.split('@')[0] },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.email.split('@')[0]
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication failed.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Successfully logged out.' });
});

// GET /api/auth/me
router.get('/me', optionalAuth, async (req, res) => {
  if (!req.user) {
    return res.json({ user: null });
  }
  
  try {
    const db = await getDb();
    const user = await db.get('SELECT id, email, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.json({ user: null });
    }
    res.json({
      user: {
        id: user.id,
        firebaseUid: req.user.firebaseUid || null,
        email: user.email,
        username: req.user.username || user.email.split('@')[0],
        picture: req.user.picture || null,
        created_at: user.created_at,
        isFirebase: req.user.isFirebase || false
      }
    });
  } catch (err) {
    res.json({ user: null });
  }
});

module.exports = router;
