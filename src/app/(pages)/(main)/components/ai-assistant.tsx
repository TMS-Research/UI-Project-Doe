"use client";

import { Button } from "@/components/ui/button";
import useChatStore from "@/stores/chat-store";
import useLayoutStore from "@/stores/layout-store";
import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import ChatInput from "./chat-input";
import { ChatContainer } from "./chat-container";

export default function AIAssistant() {
  const { clearMessages } = useChatStore();
  const { sidebarContent } = useLayoutStore();

  return sidebarContent == "syllabus" ? (
    <AnimatePresence>
      <motion.div
        initial={{ width: "0px" }}
        animate={{ width: "20rem" }}
        exit={{ width: "0px" }}
        transition={{ duration: 0.3 }}
        className="h-screen overflow-hidden pt-[62px] text-primary-foreground flex flex-col border-r sticky top-0 left-0 z-40 bg-background flex-[0_0_auto]"
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

        <ChatContainer />
        <ChatInput />
      </motion.div>
    </AnimatePresence>
  ) : (
    <></>
  );
}
