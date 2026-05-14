import * as admin from 'firebase-admin';
import path from 'path';
import logger from '../shared/utils/logger';

/**
 * Firebase Admin SDK Initialization
 */

const initializeFirebase = () => {
  try {
    if (admin.apps.length > 0) return admin.app();

    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
    }
    else if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
    else {
      logger.warn('Firebase configuration missing. Admin features may not work.');
    }

    logger.info('Firebase Admin initialized successfully');
    return admin.app();
  } catch (error) {
    logger.error('Firebase Admin initialization error:', error);
    throw error;
  }
};

export const firebaseAdmin = initializeFirebase();
export const firebaseAuth = admin.auth();
export const firebaseMessaging = admin.messaging();

