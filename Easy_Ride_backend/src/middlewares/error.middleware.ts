import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../shared/utils/apiResponse';
import { ApiError } from '../shared/errors/ApiError';
import logger from '../shared/utils/logger';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[${req.method}] ${req.url} - ${statusCode} - ${message}`);

  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
      error: err,
    });
  }

  return ApiResponse.error(res, message, statusCode, err.isOperational ? null : err);
};
