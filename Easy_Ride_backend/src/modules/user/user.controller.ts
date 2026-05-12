import { Request, Response, NextFunction } from 'express';
import { UserRepository } from './user.repository';
import { ApiResponse } from '../../shared/responses/apiResponse';
import { AppError } from '../../middlewares/error.middleware';

const userRepository = new UserRepository();

export const getMe = async (req: any, res: Response, next: NextFunction) => {
  try {
    ApiResponse.success(res, 'User profile fetched', req.user);
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.body.password) {
      return next(new AppError('This route is not for password updates. Please use /updatePassword', 400));
    }

    const updatedUser = await userRepository.update(req.user.id, req.body);
    ApiResponse.success(res, 'Profile updated', updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userRepository.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    ApiResponse.success(res, 'User fetched', user);
  } catch (error) {
    next(error);
  }
};
