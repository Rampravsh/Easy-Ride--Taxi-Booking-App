import { Socket } from 'socket.io';
import admin from 'firebase-admin';
import { UserRole, AdminRole } from '../shared/enums';
import User from '../modules/user/user.model';
import { AuthenticatedSocket, SocketData } from './socket.types';
import logger from '../shared/utils/logger';

/**
 * Socket.IO Authentication Middleware
 *
 * Verifies Firebase ID token from handshake auth or authorization header.
 * Attaches typed SocketData (userId, role, firebaseUID, adminRole?) to socket.data.
 */
export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void
): Promise<void> => {
  try {
    const rawToken =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization;

    if (!rawToken) {
      return next(new Error('Authentication error: Token missing'));
    }

    const token = typeof rawToken === 'string'
      ? rawToken.replace('Bearer ', '')
      : rawToken;

    // 1. Verify Firebase Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUID = decodedToken.uid;

    // 2. Find User in MongoDB
    const user = await User.findOne({ firebaseUID }).lean();

    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    if (user.isBlocked) {
      return next(new Error('Authentication error: Account suspended'));
    }

    // 3. Build typed SocketData
    const socketData: SocketData = {
      userId: user._id.toString(),
      role: user.role as UserRole,
      firebaseUID: user.firebaseUID,
    };

    // 4. Attach adminRole if user is an admin and has the adminRole field
    if (user.role === UserRole.ADMIN && (user as any).adminRole) {
      socketData.adminRole = (user as any).adminRole as AdminRole;
    }

    (socket as AuthenticatedSocket).data = socketData;

    next();
  } catch (error: any) {
    logger.warn(`Socket auth failed: ${error.message}`, {
      socketId: socket.id,
      ip: socket.handshake.address,
    });
    next(new Error('Authentication error: Invalid token'));
  }
};
