import { z } from 'zod';
import { registry } from './registry';

/**
 * Standardized Success Response Schema
 */
export const createSuccessResponse = (dataSchema: z.ZodTypeAny, message: string = 'Success') => {
  return z.object({
    success: z.boolean().default(true),
    message: z.string().default(message),
    data: dataSchema,
    meta: z.object({}).optional(),
  });
};

/**
 * Standardized Error Response Schema
 */
export const ErrorResponseSchema = registry.register(
  'ErrorResponse',
  z.object({
    success: z.boolean().default(false),
    message: z.string(),
    errors: z.array(
      z.object({
        path: z.string(),
        message: z.string(),
      })
    ).optional(),
    stack: z.string().optional(),
  })
);

/**
 * Reusable Response Components
 */
export const RESPONSE_SCHEMAS = {
  SUCCESS: (dataSchema: z.ZodTypeAny, message?: string) => ({
    description: message || 'Successful Operation',
    content: {
      'application/json': {
        schema: createSuccessResponse(dataSchema, message),
      },
    },
  }),
  ERROR: (description: string) => ({
    description,
    content: {
      'application/json': {
        schema: ErrorResponseSchema,
      },
    },
  }),
  PAGINATED: (dataSchema: z.ZodTypeAny, message?: string) => ({
    description: message || 'Successful Paginated Operation',
    content: {
      'application/json': {
        schema: z.object({
          success: z.boolean().default(true),
          message: z.string().default(message || 'Success'),
          data: z.array(dataSchema),
          meta: z.object({
            total: z.number(),
            page: z.number(),
            limit: z.number(),
            totalPages: z.number(),
          }),
        }),
      },
    },
  }),
};
