import {RequestInterceptor} from '../../types/api.types';
import {useUser} from "../../stores/UserStore.tsx";
import endpoints from '../config/endpoints.ts';

const PUBLIC_URLS = new Set([
    endpoints.auth.subroutes.verify,
    endpoints.auth.subroutes.verifyTokenModifyPassword,
]);

export const authInterceptor: RequestInterceptor = (url, config = {}) => {
    if (typeof url === "string" && PUBLIC_URLS.has(url)) {
        return [url, config];
    }

    const token = useUser.getState().accessToken;
    return [
        url,
        {
            ...config,
            headers: {
                ...config.headers,
                ...(token ? {Authorization: `Bearer ${token}`} : {}),
                "Content-Type": "application/json",
            },
        },
    ];
};
