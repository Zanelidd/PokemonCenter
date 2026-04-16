import {create} from 'zustand';
import {queryClient} from "../api/queryClient.ts";

interface UserState {
    accessToken: string | null;
    isAuthenticated: boolean;
    isModalOpen: boolean;
    actions: {
        setLogin: (token: string) => void;
        setLogout: () => void;
        toggleModal: () => void;
    }
}

export const useUser = create<UserState>((set) => (
    {
        accessToken: null,
        isModalOpen: false,
        isAuthenticated: false,
        actions: {
            setLogin: (token) => {
                localStorage.setItem('token', token);
                set({accessToken: token, isAuthenticated: true});
            },
            setLogout: () => {
                localStorage.removeItem('token');
                queryClient.removeQueries({ queryKey: ['me'] })
                set({accessToken: null, isAuthenticated: false});
            },
            toggleModal: () => {
                set((state) => ({isModalOpen: !state.isModalOpen}))
            },
        }
    }))

export const useAccessToken = () => useUser((s) => s.accessToken);
export const useAuthActions = () => useUser((s) => s.actions)