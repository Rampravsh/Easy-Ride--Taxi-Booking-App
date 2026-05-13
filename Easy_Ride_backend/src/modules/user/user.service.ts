import { UserRepository } from './user.repository';
import { ApiError } from '../../shared/errors/ApiError';
import { 
  UpdateProfileDTO, 
  SaveAddressDTO, 
  UserPreferencesDTO, 
  UserProfileResponse 
} from './user.types';
import { IUser } from './user.interface';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Format user object for response
   */
  private formatUserResponse(user: IUser): UserProfileResponse {
    return {
      id: user._id.toString(),
      firebaseUID: user.firebaseUID,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      authProvider: user.authProvider,
      walletBalance: user.walletBalance,
      rating: user.rating,
      savedAddresses: user.savedAddresses,
      preferences: user.preferences,
      emergencyContacts: user.emergencyContacts,
      isBlocked: user.isBlocked,
    };
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<UserProfileResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return this.formatUserResponse(user);
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updateData: UpdateProfileDTO): Promise<UserProfileResponse> {
    const user = await this.userRepository.updateProfile(userId, updateData);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return this.formatUserResponse(user);
  }

  /**
   * Add saved address
   */
  async addAddress(userId: string, addressData: SaveAddressDTO): Promise<UserProfileResponse> {
    const user = await this.userRepository.addAddress(userId, addressData);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return this.formatUserResponse(user);
  }

  /**
   * Remove saved address
   */
  async removeAddress(userId: string, addressId: string): Promise<UserProfileResponse> {
    const user = await this.userRepository.deleteAddress(userId, addressId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return this.formatUserResponse(user);
  }

  /**
   * Update device token
   */
  async updateDeviceToken(userId: string, token: string): Promise<UserProfileResponse> {
    const user = await this.userRepository.addDeviceToken(userId, token);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return this.formatUserResponse(user);
  }

  /**
   * Update preferences
   */
  async updatePreferences(userId: string, preferences: UserPreferencesDTO): Promise<UserProfileResponse> {
    const user = await this.userRepository.updatePreferences(userId, preferences);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return this.formatUserResponse(user);
  }

  /**
   * Get preferences
   */
  async getPreferences(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return user.preferences;
  }
}
