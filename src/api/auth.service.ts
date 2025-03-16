import endpoints from './config/endpoints.ts';
import http from './client.ts';

export const authService = {
  login: async (form: { username: string; password: string; email: string }) => {
    return http(endpoints.auth.subroutes.login, {
      method: 'POST',
      body: JSON.stringify(form),
    })
      .then((response) => {
        return response.json();
      });

  },
  register: async (form: { username: string; password: string; email: string }) => {
    return http(endpoints.auth.subroutes.register, {
      method: 'POST',
      body: JSON.stringify(form),
    })
      .then((response) => {
        return response.json();
      });
  },
  modifyPassword: async (form: { password: string }, userId: number) => {
    return http(`${endpoints.auth.path}/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(form),
    })
      .then((response) => {
        return response.json();
      });
  },
};