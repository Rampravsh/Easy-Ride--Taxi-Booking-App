import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiResponse } from '../shared/responses/apiResponse';

/**
 * Middleware to validate request data using Zod schema
 * @param schema Zod schema to validate against
 */
export const validate = (schema: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path[err.path.length - 1],
          message: err.message,
        }));

        return ApiResponse.error(res, 'Validation failed', 400, errors);
      }
      return next(error);
    }
  };
