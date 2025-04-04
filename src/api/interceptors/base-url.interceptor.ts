import { RequestInterceptor } from '../../types/api.types';

export const baseUrlInterceptor: RequestInterceptor = (url, config = {}) => {
  const API_BASE_URL = process.env.VITE_BACKEND_URL || 'http://localhost:3000';

  if (typeof url === 'string' && !url.startsWith('http') && !url.startsWith('//')) {
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const path = url.startsWith('/') ? url : `/${url}`;

    return [`${baseUrl}${path}`, config];
  }

  return [url, config];
};