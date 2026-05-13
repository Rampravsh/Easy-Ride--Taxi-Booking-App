import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../shared/utils/apiResponse';
import { asyncHandler } from '../../shared/utils/asyncHandler';

const authService = new AuthService();

/**
 * @desc    Authenticate with Firebase token
 * @route   POST /api/v1/auth/firebase
 * @access  Public
 */
export const authenticateWithFirebase = asyncHandler(async (req: Request, res: Response) => {
  const { token, role } = req.body;
  
  const user = await authService.verifyFirebaseToken(token, role);

  return ApiResponse.success(res, 'Authentication successful', user);
});
