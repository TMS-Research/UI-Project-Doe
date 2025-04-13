// stores/sections-store.ts
import { create } from "zustand";

type SectionsState = {
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
};

export const useSectionsStore = create<SectionsState>((set) => ({
  activeSection: null,

  setActiveSection: (section) => {
    set({ activeSection: section });
  },
}));
