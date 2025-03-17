import endpoints from "./config/endpoints.ts";
import http from "./client.ts";
import { LoginResponse, RegisterResponse } from "../types/response.types.ts";

export const authService = {
  login: async (form: {
    username: string;
    password: string;
    email: string;
  }): Promise<LoginResponse> => {
    return http(endpoints.auth.subroutes.login, {
      method: "POST",
      body: JSON.stringify(form),
    }).then((response) => {
      return response.json();
    });
  },

  register: async (form: {
    username: string;
    password: string;
    email: string;
  }): Promise<RegisterResponse> => {
    return http(endpoints.auth.subroutes.register, {
      method: "POST",
      body: JSON.stringify(form),
    }).then((response) => {
      return response.json();
    });
  },

  verifyEmail: async (token: string): Promise<LoginResponse> => {
    const body = { token };
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    return http(endpoints.auth.subroutes.verify, config).then((response) => {
      return response.json();
    });
  },

  modifyPassword: async (
    form: { password: string },
    userId: number
  ): Promise<{ message: string }> => {
    return http(`${endpoints.auth.path}/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(form),
    }).then((response) => {
      return response.json();
    });
  },
};
