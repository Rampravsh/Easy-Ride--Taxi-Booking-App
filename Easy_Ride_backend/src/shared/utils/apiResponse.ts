import { Response } from 'express';
import { ApiResponse as IApiResponse, PaginationMeta } from '../interfaces/apiResponse.interface';

export class ApiResponse {
  /**
   * Send a successful JSON response.
   */
  static success<T>(
    res: Response,
    message: string,
    data: T = {} as T,
    statusCode: number = 200,
    meta?: PaginationMeta
  ) {
    const response: IApiResponse<T> = {
      success: true,
      message,
      data,
      error: null,
      ...(meta && { meta }),
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send a paginated successful JSON response.
   */
  static paginated<T>(
    res: Response,
    message: string,
    data: T,
    meta: PaginationMeta,
    statusCode: number = 200
  ) {
    return ApiResponse.success(res, message, data, statusCode, meta);
  }

  /**
   * Send an error JSON response.
   */
  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    error: any = null
  ) {
    const response: IApiResponse = {
      success: false,
      message,
      data: null,
      error,
    };
    return res.status(statusCode).json(response);
  }
}

// Functional exports for modules that prefer them
export const successResponse = ApiResponse.success.bind(ApiResponse);
export const errorResponse = ApiResponse.error.bind(ApiResponse);
