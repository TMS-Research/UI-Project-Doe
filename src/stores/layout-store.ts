import { create } from "zustand";

// Define the types for our state
type SidebarContent = "default" | "syllabus";

interface LayoutState {
  sidebarContent: SidebarContent;
  topbarTitle: string;
  setSidebarContent: (content: SidebarContent) => void;
  setTopbarTitle: (title: string) => void;
}

// Create the store
const useLayoutStore = create<LayoutState>((set) => ({
  sidebarContent: "default",
  topbarTitle: "Study Buddy",
  setSidebarContent: (content) => set({ sidebarContent: content }),
  setTopbarTitle: (title) => set({ topbarTitle: title }),
}));

export default useLayoutStore;
