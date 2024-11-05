import { create } from "zustand";
import { User } from "../types";
import { persist } from "zustand/middleware";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (username: string, token: string) => void;
  logout: () => void;
  showModal: boolean;
  toggleModal: () => void;
}

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      showModal: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      login: (username, access_token) =>
        set({
          user: { username, access_token },
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
