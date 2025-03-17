export interface LoginResponse {
  access_token: string;
  userId: number;
  username: string;
}

export type VerificationResponse = LoginResponse;

export interface RegisterResponse {
  message: string;
}

export interface ApiError {
  message: string;
  response?: {
    data?: {
      message: string;
    };
  };
}
