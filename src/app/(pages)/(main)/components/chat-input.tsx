import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import useChatStore from "@/stores/chat-store";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/api/axios";
import { useSectionsStore } from "@/stores/sections-store";
import { useCoursesStore } from "@/stores/courses-store";
import { createPortal } from "react-dom";

// Mock data for reference suggestions
const referenceSuggestions = [
  { id: 1, type: "page", title: "Dashboard", path: "/dashboard" },
  { id: 2, type: "page", title: "Profile", path: "/profile" },
  { id: 3, type: "resource", title: "Study Guide", path: "/resources/study-guide" },
  { id: 4, type: "resource", title: "Notes", path: "/resources/notes" },
  { id: 5, type: "link", title: "External Documentation", url: "https://example.com/docs" },
];

// Command palette component
const CommandPalette = ({
  isOpen,
  position,
  onSelect,
}: {
  isOpen: boolean;
  position: { top: number; left: number };
  onSelect: (suggestion: (typeof referenceSuggestions)[0]) => void;
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed z-50 w-72 bg-background border rounded-md shadow-lg"
      style={{
        top: position.top,
        left: position.left,
        maxHeight: "300px",
        overflowY: "auto",
      }}
    >
      <div className="p-2 border-b">
        <div className="text-sm font-medium">References</div>
      </div>
      <div className="p-1">
        {referenceSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-2 hover:bg-muted cursor-pointer rounded-md flex items-center"
            onClick={() => onSelect(suggestion)}
          >
            <div
              className="w-2 h-2 rounded-full mr-2"
              style={{
                backgroundColor:
                  suggestion.type === "page" ? "#4CAF50" : suggestion.type === "resource" ? "#2196F3" : "#FF9800",
              }}
            />
            <div>
              <div className="font-medium">{suggestion.title}</div>
              <div className="text-xs text-gray-500">
                {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
};

export default function ChatInput() {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, setLoading, isLoading } = useChatStore();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSuggestions && textareaRef.current && !textareaRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    // Send the message with the input content (which includes any references)
    sendMessage(input.trim());
  };

  const { activeCourse } = useCoursesStore();
  const { activeSection } = useSectionsStore();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async (message: string) => {
      setLoading(true);

      // Add the user message to the chat with the references included
      addMessage({
        role: "user",
        content: message,
      });

      const response = await axiosInstance.post("/chat", {
        message,
        course_id: activeCourse,
        section_id: activeSection,
        context_information: {},
        persona: "coach",
        role_behavior: "You should provide actionable, concrete scheduling tips that can be implemented immediately.",
        enable_vector_search: true,
      });
      return response.data;
    },
    mutationKey: ["sendMessage"],
    onSuccess: (data) => {
      setInput("");
      console.log(data);
      addMessage({
        role: "assistant",
        content: data.message_content,
      });
      setLoading(false);
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }

    // Close suggestions on Escape key
    if (e.key === "Escape" && showSuggestions) {
      e.preventDefault();
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInput(newValue);

    // Get cursor position
    const cursorPos = e.target.selectionStart;
    setCursorPosition(cursorPos);

    // Check if we should show suggestions
    const lastAtSymbolIndex = newValue.lastIndexOf("@");
    if (lastAtSymbolIndex !== -1 && lastAtSymbolIndex < cursorPos) {
      // Only show suggestions if @ is the last special character before cursor
      const textAfterAt = newValue.substring(lastAtSymbolIndex + 1, cursorPos);
      if (!textAfterAt.includes(" ")) {
        setShowSuggestions(true);

        // Calculate position for the suggestion dropdown
        if (textareaRef.current) {
          const textareaRect = textareaRef.current.getBoundingClientRect();
          const lineHeight = parseInt(window.getComputedStyle(textareaRef.current).lineHeight) || 20;
          const lines = newValue.substring(0, cursorPos).split("\n").length - 1;

          // Position the dropdown ABOVE the cursor
          // Calculate the height of the dropdown (approximately)
          const dropdownHeight = 300; // Max height of the dropdown

          setSuggestionPosition({
            // Position above the cursor, accounting for dropdown height
            top: textareaRect.top + lines * lineHeight - dropdownHeight - 10,
            left: textareaRect.left + 10,
          });
        }
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: (typeof referenceSuggestions)[0]) => {
    // Find the position of the last @ symbol
    const lastAtSymbolIndex = input.lastIndexOf("@");

    if (lastAtSymbolIndex !== -1) {
      // Replace the @ and any text after it up to the cursor with the selected suggestion
      const beforeAt = input.substring(0, lastAtSymbolIndex);
      const afterCursor = input.substring(cursorPosition);

      // Format the reference based on type
      let referenceText = "";
      if (suggestion.type === "page") {
        referenceText = `@page:${suggestion.title}`;
      } else if (suggestion.type === "resource") {
        referenceText = `@resource:${suggestion.title}`;
      } else if (suggestion.type === "link") {
        referenceText = `@link:${suggestion.title}`;
      }

      setInput(beforeAt + referenceText + afterCursor);
      setShowSuggestions(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t p-4"
    >
      <div className="relative flex items-end">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="min-h-[60px] max-h-[200px] pr-12 resize-none "
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 bottom-2"
          disabled={!input.trim() || isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>

        <CommandPalette
          isOpen={showSuggestions}
          position={suggestionPosition}
          onSelect={handleSuggestionSelect}
        />
      </div>
    </form>
  );
}
