import { authInterceptor } from './interceptors/auth.intecerptor';
import { errorHandlerInterceptor } from './interceptors/error-handler';
import { createFetchWithInterceptors } from './interceptors/factory.interceptor';
import { baseUrlInterceptor } from './interceptors/base-url.interceptor.ts';

const http = createFetchWithInterceptors();

http.interceptors.request.use(baseUrlInterceptor)
http.interceptors.request.use(authInterceptor);
http.interceptors.response.use(errorHandlerInterceptor);

export default http;