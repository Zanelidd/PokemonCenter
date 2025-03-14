import endpoints from './config/endpoints.ts';
import http from './client.ts';

export const authService ={
login: async (form: { username: string; password: string; email: string }) => {
  return http(endpoints.auth.login, {
    method: 'POST',
    body:JSON.stringify(form),
  })
  .then((response)=>{return response.json()})

},
  register: async (form: { username: string; password: string; email: string }) => {
  return http(endpoints.auth.register, {
    method: 'POST',
    body:JSON.stringify(form),
  })
    .then((response)=>{return response.json()})
  }
}