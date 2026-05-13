import { Response, NextFunction } from 'express';
import { firebaseAuth } from '../config/firebase';
import { ApiError } from '../shared/errors/ApiError';
import { asyncHandler } from '../shared/utils/asyncHandler';
import { UserRepository } from '../modules/user/user.repository';
import { AuthRequest } from '../shared/types/express.types';

const userRepository = new UserRepository();

/**
 * Protect routes - Verifies Firebase ID Token
 */
export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // 1. Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError('You are not logged in. Please log in to get access.', 401);
  }

  try {
    // 2. Verify token with Firebase
    const decodedToken = await firebaseAuth.verifyIdToken(token);

    // 3. Check if user still exists in DB
    const currentUser = await userRepository.findByFirebaseUID(decodedToken.uid);

    if (!currentUser) {
      throw new ApiError('The user belonging to this token no longer exists.', 401);
    }

    // 4. Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error: any) {
    if (error.code === 'auth/id-token-expired') {
      throw new ApiError('Your session has expired. Please log in again.', 401);
    }
    throw new ApiError('Invalid token. Please log in again.', 401);
  }
});
