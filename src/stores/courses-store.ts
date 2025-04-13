// stores/courses-store.ts
import { create } from "zustand";

type CoursesState = {
  activeCourse: string | null;
  setActiveCourse: (course: string | null) => void;
};

export const useCoursesStore = create<CoursesState>((set) => ({
  activeCourse: null,

  setActiveCourse: (course) => {
    set({ activeCourse: course });
  },
}));
