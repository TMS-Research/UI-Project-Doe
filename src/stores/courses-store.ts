// stores/courses-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/app/api/axios";
import { Course } from "@/types/api/course.dto";

interface CoursesState {
  courses: Course[];
  activeCourse: Course | null;
  searchQuery: string;
  selectedSubject: string;
  isLoading: boolean;
  fetchCourses: () => Promise<void>;
  setActiveCourse: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedSubject: (subject: string) => void;
  resetSearch: () => void;
}

export const useCoursesStore = create<CoursesState>()(
  persist(
    (set) => ({
      courses: [],
      activeCourse: null,
      searchQuery: "",
      selectedSubject: "",
      isLoading: false,
      fetchCourses: async () => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.get("/courses");
          set({ courses: response.data });
        } catch (error) {
          console.error("Error fetching courses:", error);
        } finally {
          set({ isLoading: false });
        }
      },
      setActiveCourse: (id) => {
        set((state) => ({
          activeCourse: state.courses.find((course) => course.id === id) || null,
        }));
      },
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedSubject: (subject) => set({ selectedSubject: subject }),
      resetSearch: () => set({ searchQuery: "", selectedSubject: "" }),
    }),
    {
      name: "courses-storage",
      partialize: (state) => ({
        courses: state.courses,
        activeCourse: state.activeCourse,
        searchQuery: state.searchQuery,
        selectedSubject: state.selectedSubject,
      }),
    },
  ),
);
