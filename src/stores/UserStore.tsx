import {create} from 'zustand';
import {useCollection} from './CollectionStore.tsx';

interface UserState {
    isAuthenticated: boolean;
    isModalOpen: boolean;
    actions: {
        setLogin: () => void;
        setLogout: () => void;
        toggleModal: () => void;
    };
}

export const useUser = create<UserState>((set) => ({
    isAuthenticated: false,
    isModalOpen: false,
    actions: {
        setLogin: () => set({isAuthenticated: true}),
        setLogout: () => {
            set({isAuthenticated: false});
            useCollection.getState().clearCollection();
        },
        toggleModal: () => set((state) => ({isModalOpen: !state.isModalOpen})),
    },
}));

export const useAuthActions = () => useUser((s) => s.actions);
