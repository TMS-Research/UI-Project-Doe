// stores/sections-store.ts
import { CourseSection, CourseTopic } from "@/types/api/course.dto";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SectionsState = {
  activeSection: CourseSection | null;
  setActiveSection: (section: CourseSection | null, courseId?: string) => void;
  topics: CourseTopic[];
  setTopics: (topics: CourseTopic[]) => void;
};

export const useSectionsStore = create<SectionsState>()(
  persist(
    (set, get) => ({
      activeSection: null,
      topics: [],

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
    }),
    {
      name: "sections-storage",
    },
  ),
);
