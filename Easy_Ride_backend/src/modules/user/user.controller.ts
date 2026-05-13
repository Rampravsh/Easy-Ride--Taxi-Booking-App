import { Response } from 'express';
import { UserService } from './user.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiError } from '../../shared/errors/ApiError';
import { AuthRequest } from '../../shared/types/express.types';
import { ApiResponse } from '../../shared/utils/apiResponse';

const userService = new UserService();

export class UserController {
  /**
   * Get current user profile
   */
  static getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id.toString() as string;
    const profile = await userService.getProfile(userId);
    
    return ApiResponse.success(res, 'User profile retrieved successfully', profile);
  });

  /**
   * Update user profile
   */
  static updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id.toString() as string;
    const profile = await userService.updateProfile(userId, req.body);
    
    return ApiResponse.success(res, 'User profile updated successfully', profile);
  });

  /**
   * Add saved address
   */
  static addAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id.toString() as string;
    const profile = await userService.addAddress(userId, req.body);
    
    return ApiResponse.success(res, 'Address saved successfully', profile, 201);
  });

  /**
   * Delete saved address
   */
  static deleteAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id.toString() as string;
    const addressId = req.params.id as string;
    const profile = await userService.removeAddress(userId, addressId);
    
    return ApiResponse.success(res, 'Address deleted successfully', profile);
  });

  /**
   * Update device token
   */
  static updateDeviceToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id.toString() as string;
    const { token } = req.body;
    const profile = await userService.updateDeviceToken(userId, token);
    
    return ApiResponse.success(res, 'Device token updated successfully', profile);
  });

  /**
   * Get user preferences
   */
  static getPreferences = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id.toString() as string;
    const preferences = await userService.getPreferences(userId);
    
    return ApiResponse.success(res, 'User preferences retrieved successfully', preferences);
  });

  /**
   * Update user preferences
   */
  static updatePreferences = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id.toString() as string;
    const profile = await userService.updatePreferences(userId, req.body);
    
    return ApiResponse.success(res, 'User preferences updated successfully', profile);
  });

  /**
   * Upload profile image
   */
  static uploadProfileImage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id.toString() as string;
    
    if (!req.file) {
      throw new ApiError('Please upload an image', 400);
    }

    // In a real application, you would upload req.file.buffer to Cloudinary or S3 here
    // For now, we simulate the upload and get a URL
    const imageUrl = `https://storage.googleapis.com/easy-ride-bucket/profiles/${userId}-${Date.now()}.jpg`;
    
    const profile = await userService.updateProfile(userId, { profileImage: imageUrl });
    
    return ApiResponse.success(res, 'Profile image uploaded successfully', profile);
  });
}
