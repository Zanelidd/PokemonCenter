import {RequestInterceptor} from '../../types/api.types';
import {UserTypes} from "../../types/user.types.ts";
import {queryClient} from "../queryClient.ts";


export const authInterceptor: RequestInterceptor = (url, config = {}) => {

    if (typeof url === "string" && url.includes("/users/verify")) {
        return [url, config];
    }

    const user = queryClient.getQueryData<UserTypes>(['me']);
    const token = user?.access_token
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
