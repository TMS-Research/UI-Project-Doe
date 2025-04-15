// stores/sections-store.ts
import { create } from "zustand";
import axiosInstance from "@/app/api/axios";

type Section = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

type SectionsState = {
  activeSection: string | null;
  sections: Section[];
  filteredSections: Section[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  setActiveSection: (section: string | null) => void;
  setSearchQuery: (query: string) => void;
  fetchSections: (courseId: string) => Promise<void>;
  searchSections: () => void;
  resetSearch: () => void;
};

export const useSectionsStore = create<SectionsState>((set, get) => ({
  activeSection: null,
  sections: [],
  filteredSections: [],
  searchQuery: "",
  isLoading: false,
  error: null,

  setActiveSection: (section) => {
    set({ activeSection: section });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().searchSections();
  },

  fetchSections: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/courses/${courseId}/sections`);
      set({
        sections: response.data,
        filteredSections: response.data,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch sections";
      set({ error: errorMessage, isLoading: false });
    }
  },

  searchSections: () => {
    const { sections, searchQuery } = get();

    let filtered = [...sections];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (section) => section.title.toLowerCase().includes(query) || section.description.toLowerCase().includes(query),
      );
    }

    set({ filteredSections: filtered });
  },

  resetSearch: () => {
    set({
      searchQuery: "",
      filteredSections: get().sections,
    });
  },
}));
