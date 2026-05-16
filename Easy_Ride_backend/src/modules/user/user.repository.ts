import User from './user.model';
import { IUser } from './user.interface';
import { UpdateProfileDTO, SaveAddressDTO, UserPreferencesDTO, CreateUserDTO } from './user.types';

export class UserRepository {
  /**
   * Create a new user
   */
  async create(userData: CreateUserDTO): Promise<IUser> {
    return await User.create(userData);
  }

  /**
   * Find user by Firebase UID
   */
  async findByFirebaseUID(firebaseUID: string): Promise<IUser | null> {
    return await User.findOne({ firebaseUID });
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  /**
   * Update user profile
   */
  async updateProfile(id: string, updateData: UpdateProfileDTO): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Add a saved address
   */
  async addAddress(userId: string, addressData: SaveAddressDTO): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          savedAddresses: {
            label: addressData.label,
            address: addressData.address,
            location: {
              type: 'Point',
              coordinates: addressData.coordinates,
            },
          },
        },
      },
      { new: true }
    );
  }

  /**
   * Delete a saved address
   */
  async deleteAddress(userId: string, addressId: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          savedAddresses: { _id: addressId },
        },
      },
      { new: true }
    );
  }

  /**
   * Update device tokens (add if not exists)
   */
  async addDeviceToken(userId: string, token: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { deviceTokens: token },
      },
      { new: true }
    );
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId: string, preferences: UserPreferencesDTO): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      {
        $set: { preferences: preferences },
      },
      { new: true }
    );
  }

  /**
   * Update wallet balance
   */
  async updateWalletBalance(userId: string, amount: number): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      {
        $inc: { walletBalance: amount },
      },
      { new: true }
    );
  }

  /**
   * Check if user is blocked
   */
  async isUserBlocked(userId: string): Promise<boolean> {
    const user = await User.findById(userId).select('isBlocked');
    return user?.isBlocked || false;
  }
}
