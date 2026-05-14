import { Socket } from 'socket.io';
import admin from 'firebase-admin';
import { UserRole } from '../shared/enums';
import User from '../modules/user/user.model';
import { AuthenticatedSocket } from './socket.types';

/**
 * Socket.IO Middleware for Firebase Authentication
 */
export const socketAuthMiddleware = async (
  socket: Socket, 
  next: (err?: Error) => void
) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization;

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    // 1. Verify Firebase Token
    const decodedToken = await admin.auth().verifyIdToken(token.replace('Bearer ', ''));
    const firebaseUID = decodedToken.uid;

    // 2. Find User in MongoDB
    const user = await User.findOne({ firebaseUID });

    if (!user) {
      return next(new Error('Authentication error: User not found in database'));
    }

    // 3. Attach User Info to Socket
    (socket as AuthenticatedSocket).data = {
      userId: user._id.toString(),
      role: user.role as UserRole,
      firebaseUID: user.firebaseUID,
    };

    next();
  } catch (error) {
    console.error('Socket Auth Error:', error);
    next(new Error('Authentication error: Invalid token'));
  }
};
