import { create } from "zustand";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  studentResources?: string[];
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setLoading: (isLoading: boolean) => void;
  clearMessages: () => void;
  updateLastMessage: (content: string, keepTyping?: boolean) => void;
  setTypingComplete: () => void;
}

// Create the store
const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ],
    })),
  setLoading: (isLoading) => set({ isLoading }),
  clearMessages: () => set({ messages: [] }),
  updateLastMessage: (content, keepTyping = false) =>
    set((state) => ({
      messages: state.messages.map((msg, idx) =>
        idx === state.messages.length - 1 ? { ...msg, content, isTyping: keepTyping ? true : false } : msg,
      ),
    })),
  setTypingComplete: () =>
    set((state) => ({
      messages: state.messages.map((msg, idx) =>
        idx === state.messages.length - 1 ? { ...msg, isTyping: false } : msg,
      ),
    })),
}));

export default useChatStore;
