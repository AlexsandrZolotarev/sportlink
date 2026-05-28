export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface QueryParams {
  page?: number;
  perPage?: number;
  search?: string;
  sport?: string;
  tags?: string[];
}
