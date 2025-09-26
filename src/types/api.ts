export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string | string[];
  data?: T;
}
