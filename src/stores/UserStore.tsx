import {create} from 'zustand';
import {useCollection} from './CollectionStore.tsx';

interface UserState {
    isModalOpen: boolean;
    actions: {
        setLogout: () => void;
        toggleModal: () => void;
    };
}

export const useUser = create<UserState>((set) => ({
    isModalOpen: false,
    actions: {
        setLogout: () => {
            useCollection.getState().clearCollection();
        },
        toggleModal: () => {
            set((state) => ({isModalOpen: !state.isModalOpen}));
        },
    },
}));

export const useAuthActions = () => useUser((s) => s.actions);
