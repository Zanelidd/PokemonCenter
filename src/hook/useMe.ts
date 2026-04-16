import {useUser} from "../stores/UserStore.tsx";
import {useQuery} from "@tanstack/react-query";
import {authService} from "../api/auth.service.ts";

export const useMe = () => {
    const isAuthenticated = useUser((s) => s.isAuthenticated);

    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            return await authService.me();
        },
        enabled: isAuthenticated,

        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
    })
}