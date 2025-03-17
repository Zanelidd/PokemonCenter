import { useUser } from '../../stores/UserStore';
import { ResponseInterceptor } from '../../types/api.types';


export const errorHandlerInterceptor: ResponseInterceptor = async (response: Response) => {

  if (!response.ok) {
    if (response.status === 401) {
      useUser.getState().logout()
    }

    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response;
};