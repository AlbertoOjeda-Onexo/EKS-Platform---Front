import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      permissions: [],
      setUser: (userData) => set({ user: userData.user, permissions: userData.permissions || [] }),
      clearUser: () => set({ user: null, permissions: [] }),
    }),
    {
      name: "user-storage",
    }
  )
);