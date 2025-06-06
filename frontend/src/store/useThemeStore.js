import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "aqua",
      setTheme: (newTheme) => set({ theme: newTheme }),
    }),
    {
      name: "theme-storage",
      getStorage: () => localStorage, // or sessionStorage if you prefer
    }
  )
);
