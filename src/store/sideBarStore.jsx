import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  collapsed: false,
  toggleSidebar: () =>
    set((state) => ({
      collapsed: !state.collapsed,
    })),
  setCollapsed: (value) => set({ collapsed: value }),
}));
