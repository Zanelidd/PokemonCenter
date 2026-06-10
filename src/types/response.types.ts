export interface LoginResponse {
    userId: number;
    username: string;
    email: string;
}

export type MeResponse = {
    userId: number;
    username: string;
}

export interface ForgetPasswordResponse {
    email: string;
}

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
