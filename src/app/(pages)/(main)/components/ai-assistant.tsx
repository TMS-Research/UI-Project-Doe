"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useChatStore from "@/stores/chat-store";
import useLayoutStore from "@/stores/layout-store";
import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import ChatInput from "./chat-input";
import ChatMessage from "./chat-message";

export default function AIAssistant() {
  const { messages, clearMessages, isLoading } = useChatStore();
  const { sidebarContent } = useLayoutStore();

  return sidebarContent == "syllabus" ? (
    <AnimatePresence>
      <motion.div
        initial={{ width: "0px" }}
        animate={{ width: "20rem" }}
        exit={{ width: "0px" }}
        transition={{ duration: 0.3 }}
        className="h-screen overflow-hidden pt-[62px] text-primary-foreground flex flex-col border-r sticky top-0 left-0 z-40 bg-white flex-[0_0_auto]"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-foreground">AI Assistant</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearMessages}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {messages.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>Ask me anything about your studies!</p>
            </div>
          ) : (
            <div className="divide-y">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                />
              ))}
              {isLoading && (
                <div className="p-4 bg-secondary">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-secondary-foreground text-secondary">
                      <div className="h-5 w-5 animate-pulse">...</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="text-sm font-medium">AI Assistant</div>
                      <div className="text-sm text-foreground">
                        <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <ChatInput />
      </motion.div>
    </AnimatePresence>
  ) : (
    <></>
  );
}
