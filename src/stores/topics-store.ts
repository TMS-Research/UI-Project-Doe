import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CourseTopic } from "@/types/api/course.dto";

interface TopicsState {
  topics: CourseTopic[];
  setTopics: (topics: CourseTopic[]) => void;
}

const useTopicsStore = create<TopicsState>()(
  persist(
    (set) => ({
      topics: [],
      setTopics: (topics) => set({ topics }),
    }),
    {
      name: "topics-storage",
    },
  ),
);

export default useTopicsStore;
