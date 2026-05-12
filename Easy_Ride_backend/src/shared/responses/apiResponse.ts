import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, message: string, data: any = {}, statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      error: null,
    });
  }

  static error(res: Response, message: string, statusCode: number = 500, errors: any[] = []) {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
      errors,
    });
  }
}
