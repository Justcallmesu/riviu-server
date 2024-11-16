export interface ServerResponse<T = any> {
  status?: number;
  message: string;
  data?: T;
}
