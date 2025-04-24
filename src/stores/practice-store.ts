import { create } from "zustand";

interface PracticeState {
  practiceSessionId: string | null;
  setPracticeSessionId: (id: string | null) => void;
}

const usePracticeStore = create<PracticeState>((set) => ({
  practiceSessionId: null,
  setPracticeSessionId: (id) => set({ practiceSessionId: id }),
}));

export default usePracticeStore;
