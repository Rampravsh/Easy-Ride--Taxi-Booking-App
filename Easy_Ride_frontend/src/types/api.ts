/**
 * Generic API Response wrapper matching the Swagger success schema.
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    [key: string]: any;
  };
}

/**
 * Standard Paginated Response wrapper matching the Swagger paginated schema.
 */
export interface ApiPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Zod validation and operational error subschema structure.
 */
export interface ApiSubError {
  path: string;
  message: string;
}

/**
 * Standardized Error Response matching the Swagger error schema.
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ApiSubError[];
  stack?: string;
}
