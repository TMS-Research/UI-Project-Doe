// stores/sections-store.ts
import { CourseSection, CourseTopic } from "@/types/api/course.dto";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SectionsState = {
  activeSection: CourseSection | null;
  setActiveSection: (section: CourseSection | null, courseId?: string) => void;
  topics: CourseTopic[];
  setTopics: (topics: CourseTopic[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resetSearch: () => void;
  fetchSections: (courseId: string) => Promise<void>;
  isLoading: boolean;
  filteredSections: CourseSection[];
};

export const useSectionsStore = create<SectionsState>()(
  persist(
    (set, get) => ({
      activeSection: null,
      topics: [],
      searchQuery: "",
      isLoading: false,
      filteredSections: [],

      setActiveSection: (section, courseId) => {
        set(() => {
          if (!section || !courseId) {
            return { activeSection: section };
          }

          return {
            activeSection: section,
          };
        });
      },

      setTopics: (topics) => {
        set(() => ({ topics }));
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
        const { topics } = get();
        const allSections = topics.flatMap((topic) => topic.sections);

        if (!query.trim()) {
          set({ filteredSections: allSections });
        } else {
          const filtered = allSections.filter((section) => section.title.toLowerCase().includes(query.toLowerCase()));
          set({ filteredSections: filtered });
        }
      },

      resetSearch: () => {
        set({ searchQuery: "" });
        const { topics } = get();
        const allSections = topics.flatMap((topic) => topic.sections);
        set({ filteredSections: allSections });
      },

      fetchSections: async (courseId) => {
        if (!courseId) return;

        set({ isLoading: true });
        try {
          const { topics } = get();
          const allSections = topics.flatMap((topic) => topic.sections);
          set({ filteredSections: allSections });
        } catch (error) {
          console.error("Error fetching sections:", error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "sections-storage",
    },
  ),
);
