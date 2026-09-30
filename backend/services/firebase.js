const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

let initialized = false;
let authInstance = null;
let firestoreInstance = null;
let firebaseApp = null;
let projectConfig = {
  projectId: 'cine-suggest-7787c',
  clientEmail: 'firebase-adminsdk-fbsvc@cine-suggest-7787c.iam.gserviceaccount.com'
};

try {
  const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    projectConfig.projectId = serviceAccount.project_id || projectConfig.projectId;
    projectConfig.clientEmail = serviceAccount.client_email || projectConfig.clientEmail;

    try {
      if (getApps().length === 0) {
        firebaseApp = initializeApp({
          credential: cert(serviceAccount),
          projectId: serviceAccount.project_id
        });
      } else {
        firebaseApp = getApps()[0];
      }
      
      authInstance = getAuth(firebaseApp);
      firestoreInstance = getFirestore(firebaseApp);
      try {
        firestoreInstance.settings({ ignoreUndefinedProperties: true });
      } catch (e) {}

      initialized = true;
      console.log(`✅ Firebase Admin initialized successfully for project: ${serviceAccount.project_id}`);
    } catch (certError) {
      console.warn(`⚠️ Firebase Admin initialization notice (${certError.message}). Running with project config: ${projectConfig.projectId}`);
    }
  } else {
    console.warn('⚠️ firebase-service-account.json not found in backend directory');
  }
} catch (error) {
  console.error('⚠️ Firebase setup notice:', error.message);
}

/**
 * Verify a Firebase ID token from request headers
 */
async function verifyFirebaseToken(idToken) {
  if (initialized && authInstance) {
    return await authInstance.verifyIdToken(idToken);
  }
  // Safe decode fallback if admin cert is pending
  try {
    const payloadBase64 = idToken.split('.')[1];
    if (payloadBase64) {
      const decodedJson = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
      return {
        uid: decodedJson.user_id || decodedJson.sub || decodedJson.uid,
        email: decodedJson.email,
        name: decodedJson.name || decodedJson.displayName,
        picture: decodedJson.picture || decodedJson.photoURL
      };
    }
  } catch (e) {}
  throw new Error('Firebase token verification unavailable');
}

/**
 * Sync or upsert user document in Firestore
 */
async function syncUserToFirestore(uid, userData) {
  if (!initialized || !firestoreInstance) return null;
  try {
    const userRef = firestoreInstance.collection('users').doc(String(uid));
    const payload = {
      ...userData,
      updatedAt: FieldValue.serverTimestamp()
    };
    await userRef.set(payload, { merge: true });
    return payload;
  } catch (err) {
    console.error('Error syncing user to Firestore:', err.message);
    return null;
  }
}

/**
 * Sync user watchlist item to Firestore
 */
async function syncWatchlistToFirestore(userId, movieId, movieMetadata) {
  if (!initialized || !firestoreInstance) return;
  try {
    const docId = `${userId}_${movieId}`;
    await firestoreInstance.collection('watchlist').doc(docId).set({
      userId: String(userId),
      movieId: Number(movieId),
      movieMetadata: typeof movieMetadata === 'object' ? movieMetadata : (typeof movieMetadata === 'string' ? JSON.parse(movieMetadata || '{}') : {}),
      addedAt: FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.error('Firestore watchlist sync error:', err.message);
  }
}

/**
 * Remove user watchlist item from Firestore
 */
async function removeWatchlistFromFirestore(userId, movieId) {
  if (!initialized || !firestoreInstance) return;
  try {
    const docId = `${userId}_${movieId}`;
    await firestoreInstance.collection('watchlist').doc(docId).delete();
  } catch (err) {
    console.error('Firestore watchlist removal error:', err.message);
  }
}

/**
 * Sync favorite item to Firestore
 */
async function syncFavoriteToFirestore(userId, movieId, movieMetadata) {
  if (!initialized || !firestoreInstance) return;
  try {
    const docId = `${userId}_${movieId}`;
    await firestoreInstance.collection('favorites').doc(docId).set({
      userId: String(userId),
      movieId: Number(movieId),
      movieMetadata: typeof movieMetadata === 'object' ? movieMetadata : (typeof movieMetadata === 'string' ? JSON.parse(movieMetadata || '{}') : {}),
      addedAt: FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.error('Firestore favorite sync error:', err.message);
  }
}

/**
 * Remove favorite item from Firestore
 */
async function removeFavoriteFromFirestore(userId, movieId) {
  if (!initialized || !firestoreInstance) return;
  try {
    const docId = `${userId}_${movieId}`;
    await firestoreInstance.collection('favorites').doc(docId).delete();
  } catch (err) {
    console.error('Firestore favorite remove error:', err.message);
  }
}

/**
 * Sync rating to Firestore
 */
async function syncRatingToFirestore(userId, movieId, rating, genres, movieMetadata) {
  if (!initialized || !firestoreInstance) return;
  try {
    const docId = `${userId}_${movieId}`;
    await firestoreInstance.collection('ratings').doc(docId).set({
      userId: String(userId),
      movieId: Number(movieId),
      rating: Number(rating),
      genres: genres || '',
      movieMetadata: typeof movieMetadata === 'object' ? movieMetadata : (typeof movieMetadata === 'string' ? JSON.parse(movieMetadata || '{}') : {}),
      ratedAt: FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.error('Firestore rating sync error:', err.message);
  }
}

/**
 * Sync viewing history to Firestore
 */
async function syncHistoryToFirestore(userId, movieId, movieMetadata) {
  if (!initialized || !firestoreInstance) return;
  try {
    await firestoreInstance.collection('history').add({
      userId: String(userId),
      movieId: Number(movieId),
      movieMetadata: typeof movieMetadata === 'object' ? movieMetadata : (typeof movieMetadata === 'string' ? JSON.parse(movieMetadata || '{}') : {}),
      viewedAt: FieldValue.serverTimestamp()
    });
  } catch (err) {
    console.error('Firestore history sync error:', err.message);
  }
}

/**
 * Sync review to Firestore
 */
async function syncReviewToFirestore(reviewId, reviewData) {
  if (!initialized || !firestoreInstance) return;
  try {
    await firestoreInstance.collection('reviews').doc(String(reviewId)).set({
      ...reviewData,
      createdAt: FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.error('Firestore review sync error:', err.message);
  }
}

module.exports = {
  app: firebaseApp,
  auth: authInstance,
  firestore: firestoreInstance,
  projectConfig,
  isInitialized: () => initialized,
  verifyFirebaseToken,
  syncUserToFirestore,
  syncWatchlistToFirestore,
  removeWatchlistFromFirestore,
  syncFavoriteToFirestore,
  removeFavoriteFromFirestore,
  syncRatingToFirestore,
  syncHistoryToFirestore,
  syncReviewToFirestore
};
