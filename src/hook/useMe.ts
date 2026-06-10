import {useQuery} from "@tanstack/react-query";
import {authService} from "../api/auth.service.ts";

export const useMe = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            return await authService.me();
        },
        retry: false,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
    });
};
