import { useUser } from '../../stores/UserStore';
import { RequestInterceptor } from '../../types/api.types';

export const authInterceptor: RequestInterceptor = (url, config = {}) => {
  if (typeof url === "string" && url.includes("/users/verify")) {
    return [url, config];
  }

  const token = useUser.getState().user?.access_token;
  return [
    url,
    {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  ];
};
