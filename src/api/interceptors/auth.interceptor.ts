import {RequestInterceptor} from '../../types/api.types';

export const authInterceptor: RequestInterceptor = (url, config = {}) => {
    return [
        url,
        {
            ...config,
            headers: {
                ...config.headers,
                "Content-Type": "application/json",
            },
        },
    ];
};
