import { firebaseAuth } from '../../config/firebase';
import { UserRepository } from '../user/user.repository';
import { ApiError } from '../../shared/errors/ApiError';
import { UserRole } from '../../shared/enums';
import { IUser } from '../user/user.model';
import mongoose from 'mongoose';
import Rider from '../rider/rider.model';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Verify Firebase Token and get or create user
   */
  async verifyFirebaseToken(token: string, requestedRole: UserRole) {
    try {
      // 1. Verify token with Firebase Admin
      const decodedToken = await firebaseAuth.verifyIdToken(token);
      const { uid, email, phone_number, name, picture } = decodedToken;

      // 2. Find user in database
      let user = await this.userRepository.findByFirebaseUID(uid);

      if (!user) {
        // 3. Create user if not exists
        user = await this.userRepository.create({
          firebaseUID: uid,
          name: name || 'User',
          email: email,
          phone: phone_number,
          role: requestedRole,
          avatar: picture,
          isVerified: true, // Firebase users are typically verified
        });

        // 4. If role is Rider, create a Rider profile
        if (requestedRole === UserRole.RIDER) {
          await Rider.create({
            user: user._id,
            licenseNumber: 'PENDING', // To be updated by rider later
          });
        }
      }

      return {
        _id: user._id,
        firebaseUID: user.firebaseUID,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
      };
    } catch (error: any) {
      if (error.code === 'auth/id-token-expired') {
        throw new ApiError('Firebase token has expired', 401);
      }
      if (error.code === 'auth/argument-error') {
        throw new ApiError('Invalid Firebase token', 401);
      }
      throw new ApiError(error.message || 'Authentication failed', 401);
    }
  }
}
