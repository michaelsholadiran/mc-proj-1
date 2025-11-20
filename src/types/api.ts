export type APIError = Error & {
  status?: number;
  response?: ApiResponse;
};

export type ApiResponse = {
  isSuccessful: boolean;
  message: string;
  code: string;
};

// Generic paginated response interface
export interface PaginatedResponse<T> {
  data: {
    data: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
  isSuccessful: boolean;
  message: string;
  code: string;
}
