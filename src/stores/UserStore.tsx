import {create} from 'zustand';
import {queryClient} from "../api/queryClient.ts";
import {useCollection} from "./CollectionStore.tsx";

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
        accessToken: localStorage.getItem('token'),
        isModalOpen: false,
        isAuthenticated: !!localStorage.getItem('token'),
        actions: {
            setLogin: (token) => {
                localStorage.setItem('token', token);
                set({accessToken: token, isAuthenticated: true});
            },
            setLogout: () => {
                localStorage.removeItem('token');
                queryClient.removeQueries({ queryKey: ['me'] });
                useCollection.getState().clearCollection();
                set({accessToken: null, isAuthenticated: false});
            },
            toggleModal: () => {
                set((state) => ({isModalOpen: !state.isModalOpen}))
            },
        }
    }))

export const useAccessToken = () => useUser((s) => s.accessToken);
export const useAuthActions = () => useUser((s) => s.actions)