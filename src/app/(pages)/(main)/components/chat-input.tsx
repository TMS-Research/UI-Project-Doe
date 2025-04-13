import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import useChatStore from "@/stores/chat-store";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/api/axios";
import { useSectionsStore } from "@/stores/sections-store";
import { useCoursesStore } from "@/stores/courses-store";
export default function ChatInput() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, setLoading, isLoading } = useChatStore();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
  };

  const { activeCourse } = useCoursesStore();
  const { activeSection } = useSectionsStore();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async (message: string) => {
      setLoading(true);
      addMessage({
        role: "user",
        content: input.trim(),
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
          onChange={(e) => setInput(e.target.value)}
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
      </div>
    </form>
  );
}
