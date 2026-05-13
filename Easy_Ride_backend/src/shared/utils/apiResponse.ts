import { Response } from 'express';
import { ApiResponse as IApiResponse } from '../interfaces/apiResponse.interface';

export class ApiResponse {
  static success<T>(res: Response, message: string, data: T = {} as T, statusCode: number = 200) {
    const response: IApiResponse<T> = {
      success: true,
      message,
      data,
      error: null,
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, statusCode: number = 500, error: any = null) {
    const response: IApiResponse = {
      success: false,
      message,
      data: null,
      error,
    };
    return res.status(statusCode).json(response);
  }
}

// Also keeping functional exports for those who prefer them
export const successResponse = ApiResponse.success;
export const errorResponse = ApiResponse.error;
