import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X } from "lucide-react";
import useChatStore from "@/stores/chat-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/api/axios";
import { useSectionsStore } from "@/stores/sections-store";
import { useCoursesStore } from "@/stores/courses-store";
import { useAuthStore } from "@/stores/auth-store";
import { LoadingDots } from "@/components/ui/loading-dots";

interface StudentResource {
  course_id: string;
  resource_type: string;
  title: string;
  description: string;
  file_path_or_url: string;
  id: string;
  user_id: string;
  version: number;
  deleted_at: string | null;
  deleted_by: string | null;
  updated_at: string;
  updated_by: string;
  created_at: string;
  created_by: string;
}

interface SelectedReference {
  id: string;
  title: string;
  resource_type: string;
}

// Command palette component
const CommandPalette = ({
  isOpen,
  onSelect,
  position,
}: {
  isOpen: boolean;
  onSelect: (suggestion: StudentResource) => void;
  position: { top: number; left: number };
}) => {
  const { activeCourse } = useCoursesStore();
  const { user } = useAuthStore();

  const { data: referenceSuggestions } = useQuery<StudentResource[]>({
    queryKey: ["referenceSuggestions"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/student-resources?course_id=${activeCourse?.id}&user_id=${user?.id}`);
      return response.data;
    },
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 w-72 bg-background border rounded-md shadow-lg"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="p-2 border-b">
        <div className="text-sm font-medium">References</div>
      </div>
      <div className="p-1 max-h-[300px] overflow-y-auto">
        {referenceSuggestions?.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-2 hover:bg-muted cursor-pointer rounded-md flex items-center"
            onClick={() => {
              console.log("Selected suggestion:", suggestion);
              onSelect(suggestion);
            }}
          >
            <div
              className="w-2 h-2 rounded-full mr-2"
              style={{
                backgroundColor: "#2196F3",
              }}
            />
            <div>
              <div className="font-medium">{suggestion.title}</div>
              <div className="text-xs text-gray-500">
                {suggestion.resource_type.charAt(0).toUpperCase() + suggestion.resource_type.slice(1)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ChatInput() {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [selectedReferences, setSelectedReferences] = useState<SelectedReference[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { addMessage, setLoading, isLoading, updateLastMessage } = useChatStore();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInTextarea = textareaRef.current?.contains(target);
      const isClickInPopover = popoverRef.current?.contains(target);

      if (showSuggestions && !isClickInTextarea && !isClickInPopover) {
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

    // Send the message with the input content and all reference IDs
    sendMessage(input.trim());
  };

  const { activeCourse } = useCoursesStore();
  const { activeSection } = useSectionsStore();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async (message: string) => {
      setLoading(true);

      // Add the user message to the chat
      addMessage({
        role: "user",
        content: message,
        studentResources: selectedReferences.map((ref) => ref.title),
      });

      // Add a temporary loading message for the assistant
      addMessage({
        role: "assistant",
        content: "Thinking...",
        isTyping: true,
      });

      const response = await axiosInstance.post("/chat", {
        message,
        course_id: activeCourse?.id,
        section_id: activeSection?.id,
        context_information: {
          student_resources_id: selectedReferences.map((ref) => ref.id)[0],
        },
        enable_vector_search: true,
      });

      return response.data;
    },
    mutationKey: ["sendMessage"],
    onSuccess: (data) => {
      setInput("");
      setSelectedReferences([]);
      updateLastMessage(data.message_content, true);
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

    // Check if we should show suggestions
    const lastAtSymbolIndex = newValue.lastIndexOf("@");
    const cursorPos = e.target.selectionStart;

    if (lastAtSymbolIndex !== -1 && lastAtSymbolIndex < cursorPos) {
      // Only show suggestions if @ is the last special character before cursor
      const textAfterAt = newValue.substring(lastAtSymbolIndex + 1, cursorPos);
      if (!textAfterAt.includes(" ")) {
        setShowSuggestions(true);

        // Calculate position for the popover
        if (textareaRef.current) {
          const rect = textareaRef.current.getBoundingClientRect();
          const lineHeight = parseInt(window.getComputedStyle(textareaRef.current).lineHeight) || 20;
          const lines = newValue.substring(0, cursorPos).split("\n").length - 1;

          setPopoverPosition({
            top: rect.top + lines * lineHeight - 300, // 300px is approximate height of popover
            left: rect.left + 16, // 16px padding from left
          });
        }
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: StudentResource) => {
    // Add the reference to selectedReferences if it's not already there
    if (!selectedReferences.some((ref) => ref.id === suggestion.id)) {
      setSelectedReferences([
        ...selectedReferences,
        {
          id: suggestion.id,
          title: suggestion.title,
          resource_type: suggestion.resource_type,
        },
      ]);
    }

    // Remove the @ and any text after it up to the cursor
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const lastAtSymbolIndex = input.lastIndexOf("@", cursorPos);

    if (lastAtSymbolIndex !== -1) {
      const newInput = input.substring(0, lastAtSymbolIndex) + input.substring(cursorPos);
      setInput(newInput);
    }

    setShowSuggestions(false);
  };

  const removeReference = (referenceId: string) => {
    setSelectedReferences(selectedReferences.filter((ref) => ref.id !== referenceId));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t p-4"
    >
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedReferences.map((reference) => (
          <div
            key={reference.id}
            className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full text-sm"
          >
            <span className="text-primary">{reference.title}</span>
            <button
              type="button"
              onClick={() => removeReference(reference.id)}
              className="text-primary hover:text-primary/80"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <div className="relative flex items-end">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder="Type your message... Use @ to reference resources"
          className="max-h-[200px] pr-12 resize-none leading-5 py-2"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 bottom-2"
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? <LoadingDots className="scale-75" /> : <Send className="h-4 w-4" />}
        </Button>

        <div ref={popoverRef}>
          <CommandPalette
            isOpen={showSuggestions}
            onSelect={handleSuggestionSelect}
            position={popoverPosition}
          />
        </div>
      </div>
    </form>
  );
}
