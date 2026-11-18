import {useQuery} from "@tanstack/react-query";
import {authService} from "../api/auth.service.ts";
import {useUser} from "../stores/UserStore.tsx";

export const useMe = () => {
    const setLogin = useUser(s => s.actions.setLogin);

    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const data = await authService.me();
            setLogin();
            return data;
        },
        retry: false,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
    });
};
