import { create } from "zustand";

// Define the types for our state
type SidebarContent = "default" | "syllabus";

interface LayoutState {
  sidebarContent: SidebarContent;
  topbarTitle: string;
  isSidebarCollapsed: boolean;
  setSidebarContent: (content: SidebarContent) => void;
  setTopbarTitle: (title: string) => void;
  toggleSidebar: () => void;
}

// Create the store
const useLayoutStore = create<LayoutState>((set) => ({
  sidebarContent: "default",
  topbarTitle: "Study Buddy",
  isSidebarCollapsed: false,
  setSidebarContent: (content) => set({ sidebarContent: content }),
  setTopbarTitle: (title) => set({ topbarTitle: title }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));

export default useLayoutStore;
