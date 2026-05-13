import * as admin from 'firebase-admin';
import path from 'path';

/**
 * Firebase Admin SDK Initialization
 *
 * For production, use environment variables for service account details.
 * For development, you can use a JSON file path.
 */

const initializeFirebase = () => {
  try {
    if (admin.apps.length > 0) return admin.app();

    // Option 1: Use environment variable pointing to JSON file
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
    }
    // Option 2: Use individual environment variables (better for Heroku/Vercel/Docker)
    else if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
    // Fallback for development if no env vars are set (be careful not to commit sensitive files)
    else {
      console.warn('Firebase configuration missing. Admin features may not work.');
    }

    console.log('Firebase Admin initialized successfully');
    return admin.app();
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw error;
  }
};

export const firebaseAdmin = initializeFirebase();
export const firebaseAuth = admin.auth();
