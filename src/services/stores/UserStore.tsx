import { create } from 'zustand';
import { User } from '../types';
import { persist } from 'zustand/middleware';

interface UserState {
  user: User | null;
  getUser : ()=> User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (username: string, token: string,userId :number) => void;
  logout: () => void;
  showModal: boolean;
  toggleModal: () => void;
}

export const useUser = create<UserState>()(
  persist(
    (set,get) => ({
      user: null,
      isAuthenticated: false,
      showModal: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
      getUser : ()=>
      {return get().user},
      login: (username:string, access_token:string,userId:number) =>
        set({
          user: { username, access_token,userId },
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      toggleModal: () =>
        set((state) => ({
          showModal: !state.showModal,
        })),
    }),
    {
      name: "user-storage",
    }
  )
);
