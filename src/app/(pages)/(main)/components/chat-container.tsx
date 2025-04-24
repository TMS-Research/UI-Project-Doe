import { useEffect, useRef, useMemo } from "react";
import useChatStore from "@/stores/chat-store";
import { ChatMessage } from "./chat-message";

export const ChatContainer = () => {
  const { messages } = useChatStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isTyping = useMemo(() => messages.some((msg) => msg.isTyping), [messages]);

  // Auto scroll to bottom when new messages arrive or when typing
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto"
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          role={message.role}
          content={message.content}
          isTyping={message.isTyping}
          studentResources={message.studentResources}
        />
      ))}
    </div>
  );
};
