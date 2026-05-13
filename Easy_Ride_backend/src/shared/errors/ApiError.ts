export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors: any[];

  constructor(message: string, statusCode: number, errors: any[] = [], isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}
