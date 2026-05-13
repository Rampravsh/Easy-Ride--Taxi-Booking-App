import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../shared/errors/ApiError';
import User from '../modules/user/user.model';
import { restrictTo } from './role.middleware';

export const protect = async (req: any, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new ApiError('You are not logged in! Please log in to get access.', 401));
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new ApiError('The user belonging to this token no longer exists.', 401));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    next(new ApiError('Invalid token. Please log in again!', 401));
  }
};

export { restrictTo };

