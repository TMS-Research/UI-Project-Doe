"use client";

import axiosInstance from "@/app/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import useChatStore from "@/stores/chat-store";
import { useCoursesStore } from "@/stores/courses-store";
import usePracticeStore from "@/stores/practice-store";
import { useSectionsStore } from "@/stores/sections-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BookOpen, Brain, Check, CheckCircle, Copy, MessageCircle, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import PracticeHistory from "./PracticeHistory";
import useTopicsStore from "@/stores/topics-store";

export interface LearningContent {
  conceptExplanation: string;
  problems: {
    id: string;
    question: string;
    steps: string[];
    hints: string[];
    solution: string;
    alternativeSolutions?: string[];
    relatedTopics: string[];
  }[];
  practiceSets: {
    id: string;
    type: "mcq" | "short-answer" | "essay" | "flashcard";
    question: string;
    options?: string[];
    answer?: string;
  }[];
  summary: {
    keyTakeaways: string[];
    observations: string[];
  };
}

export function LearningContentPanel() {
  const [selectedSection, setSelectedSection] = useState<string>("concept");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; text: string } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { addMessage, setLoading, updateLastMessage } = useChatStore();
  const { activeCourse } = useCoursesStore();
  const { activeSection, setActiveSection } = useSectionsStore();
  const { topics } = useTopicsStore();
  const { setPracticeSessionId } = usePracticeStore();

  const { data: courseContent } = useQuery({
    queryKey: ["content", activeCourse, activeSection],
    queryFn: async () => {
      const response = await axiosInstance.get(`/courses/${activeCourse?.id}/sections/${activeSection?.id}`);
      return response.data;
    },
    enabled: !!activeCourse?.id && !!activeSection?.id,
  });

  const { mutate: sendMessage } = useMutation({
    mutationFn: async (message: string) => {
      setLoading(true);
      addMessage({
        role: "user",
        content: message,
      });

      // Add a temporary loading message for the assistant
      addMessage({
        role: "assistant",
        content: "Thinking...",
        isTyping: true,
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
      // Update the message content but keep isTyping true to show the typing animation
      updateLastMessage(data.message_content, true);
      setLoading(false);
    },
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText) {
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        text: selectedText,
      });
    }
  };

  const handleElaborationRequest = (text: string) => {
    sendMessage(`Can you provide further elaboration on this concept: "${text}"?`);
    setContextMenu(null);
  };

  const handleSimplificationRequest = (text: string) => {
    sendMessage(`Can you explain this in simpler language: "${text}"?`);
    setContextMenu(null);
  };

  // Close context menu when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      setContextMenu(null);
    }
  };

  // Close context menu when selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setContextMenu(null);
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  const { mutate: startPractice } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        `/practice/session/start`,
        {},
        {
          params: {
            section_id: activeSection?.id,
          },
        },
      );
      return response.data;
    },
    mutationKey: ["startPractice"],
    onSuccess: (data) => {
      console.log(data);
      setPracticeSessionId(data.session_id);
    },
  });

  const handleStartLearning = async () => {
    try {
      await startPractice();
      // The navigation will be handled by the Link component
    } catch (error) {
      console.error("Failed to start practice session:", error);
    }
  };

  useEffect(() => {
    console.log(topics);
  }, [topics]);

  return (
    <div
      className="h-full flex flex-col"
      ref={contentRef}
      onClick={handleClickOutside}
      onContextMenu={handleContextMenu}
    >
      {/* Navigation Tabs */}
      <div className="flex gap-2 py-6 px-8 border-b">
        <Button
          variant={selectedSection === "concept" ? "default" : "ghost"}
          onClick={() => setSelectedSection("concept")}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Concepts
        </Button>
        <Button
          variant={selectedSection === "practice" ? "default" : "ghost"}
          onClick={() => setSelectedSection("practice")}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Practice
        </Button>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1 p-8">
        {selectedSection === "concept" && (
          <div className="space-y-6">
            {/* Concept Explanation Section */}
            <div className="mb-8">
              <div className="prose prose-sm max-w-none dark:prose-invert space-y-4">
                <Markdown
                  components={{
                    h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 text-foreground">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 text-foreground">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-medium mb-3 text-foreground">{children}</h3>,
                    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                    li: ({ children }) => <li className="text-foreground">{children}</li>,
                    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                    code: CodeComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>,
                  }}
                >
                  {courseContent?.concepts}
                </Markdown>
                <Markdown
                  components={{
                    h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 text-foreground">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 text-foreground">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-medium mb-3 text-foreground">{children}</h3>,
                    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                    li: ({ children }) => <li className="text-foreground">{children}</li>,
                    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border-collapse border border-border">{children}</table>
                      </div>
                    ),
                    th: ({ children }) => <th className="border border-border bg-muted p-2 text-left">{children}</th>,
                    td: ({ children }) => <td className="border border-border p-2">{children}</td>,
                    code: CodeComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>,
                  }}
                >
                  {courseContent?.problems}
                </Markdown>
                <Markdown
                  components={{
                    h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 text-foreground">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 text-foreground">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-medium mb-3 text-foreground">{children}</h3>,
                    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                    li: ({ children }) => <li className="text-foreground">{children}</li>,
                    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border-collapse border border-border">{children}</table>
                      </div>
                    ),
                    th: ({ children }) => <th className="border border-border bg-muted p-2 text-left">{children}</th>,
                    td: ({ children }) => <td className="border border-border p-2">{children}</td>,
                    code: CodeComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>,
                  }}
                >
                  {courseContent?.summary}
                </Markdown>
              </div>
            </div>
          </div>
        )}

        {selectedSection === "practice" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Practice Sets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Practice CTA */}
                  <div className="bg-primary/5 rounded-lg p-6 text-center">
                    <h3 className="text-xl font-semibold mb-2">Ready to Practice?</h3>
                    <p className="text-muted-foreground mb-4">
                      Test your understanding with interactive practice questions
                    </p>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto"
                      asChild
                      onClick={handleStartLearning}
                    >
                      <Link href={`/courses/${activeCourse?.code}/learn/${activeSection?.slug}/practice`}>
                        <Play className="w-4 h-4 mr-2" />
                        Start Practice
                      </Link>
                    </Button>
                  </div>

                  {/* Practice History */}
                  <PracticeHistory />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </ScrollArea>

      {/* Next Section Button */}
      <div className="p-4 border-t flex justify-end">
        <Button
          size="lg"
          className="w-full sm:w-auto"
          asChild
          disabled={!activeSection}
          onClick={() => {
            const sections = topics.flatMap((topic) => topic.sections);
            const currentIndex = sections.findIndex((section) => section.id === activeSection?.id);
            setActiveSection(sections[currentIndex + 1]);
          }}
        >
          <Link
            href={`/courses/${activeCourse?.code}/learn/${(() => {
              const sections = topics.flatMap((topic) => topic.sections);
              const currentIndex = sections.findIndex((section) => section.id === activeSection?.id);
              return sections[currentIndex + 1]?.slug || "";
            })()}`}
          >
            Next Section
          </Link>
        </Button>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-primary text-primary-foreground rounded-md shadow-lg border border-primary/20"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            minWidth: "200px",
          }}
        >
          <div className="p-2 space-y-1">
            <button
              className="w-full flex items-center px-3 py-2 text-sm hover:bg-primary-foreground/10 rounded-md"
              onClick={() => handleElaborationRequest(contextMenu.text)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Further Elaboration
            </button>
            <button
              className="w-full flex items-center px-3 py-2 text-sm hover:bg-primary-foreground/10 rounded-md"
              onClick={() => handleSimplificationRequest(contextMenu.text)}
            >
              <Brain className="w-4 h-4 mr-2" />
              Simpler Language
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Example content for Data Structures
interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeComponent = ({ className, children, inline, ...props }: CodeProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "";
  const codeString = String(children).replace(/\n$/, "");

  const handleCopyCode = async () => {
    toast.success("Code copied to clipboard");
    await navigator.clipboard.writeText(codeString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (inline) {
    return (
      <code
        className="bg-muted px-1.5 py-0.5 rounded-sm"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative group border rounded-md">
      <div className="flex items-center justify-between px-4 py-2 bg-background text-white rounded-t-md">
        <span className="text-sm font-mono">{lang || "javascript"}</span>
        <Button
          variant="ghost"
          size="icon"
          className={`opacity-0 group-hover:opacity-100 transition-opacity ${
            isCopied ? "bg-green-500/20 text-green-500" : ""
          }`}
          onClick={handleCopyCode}
        >
          {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span className="sr-only">{isCopied ? "Copied!" : "Copy code"}</span>
        </Button>
      </div>
      <SyntaxHighlighter
        language={lang || "javascript"}
        style={nightOwl as { [key: string]: React.CSSProperties }}
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: "0.375rem",
          borderBottomRightRadius: "0.375rem",
        }}
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};
