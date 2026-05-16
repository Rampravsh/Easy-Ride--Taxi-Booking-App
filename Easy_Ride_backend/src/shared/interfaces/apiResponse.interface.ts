export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  error: any;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
