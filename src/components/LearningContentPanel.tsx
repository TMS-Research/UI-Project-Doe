"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  MessageCircle,
  BookOpen,
  Brain,
  CheckCircle,
  Save,
  ChevronRight,
  ChevronLeft,
  History,
  Play,
  Home,
} from "lucide-react";
import useChatStore from "@/stores/chat-store";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/api/axios";
import { useSectionsStore } from "@/stores/sections-store";
import { useCoursesStore } from "@/stores/courses-store";
import Markdown from "react-markdown";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";

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

interface LearningContentPanelProps {
  content: LearningContent;
  onSaveQuestion?: (questionId: string) => void;
}

const exampleContent: LearningContent = {
  conceptExplanation: `# Data Structures: Fundamental Concepts

## Introduction
Data structures are specialized formats for organizing, processing, retrieving, and storing data. They are essential for creating efficient algorithms and writing high-performance software.

## Basic Data Structures

### 1. Arrays
Arrays are collections of elements stored at contiguous memory locations. They are the simplest data structure and are often used to implement other data structures.

**Key Characteristics:**
- Fixed size (in most programming languages)
- Constant-time access to elements
- Contiguous memory allocation

### 2. Linked Lists
Linked lists consist of nodes where each node contains a data field and a reference to the next node in the sequence.

**Types of Linked Lists:**
- Singly Linked List
- Doubly Linked List
- Circular Linked List

### 3. Stacks
A stack is a linear data structure that follows the Last In First Out (LIFO) principle.

**Operations:**
- Push: Add an element
- Pop: Remove the top element
- Peek: View the top element

### 4. Queues
A queue is a linear data structure that follows the First In First Out (FIFO) principle.

**Operations:**
- Enqueue: Add an element
- Dequeue: Remove an element
- Front: View the first element

## Advanced Data Structures

### 1. Trees
Trees are hierarchical data structures consisting of nodes connected by edges.

**Common Types:**
- Binary Trees
- Binary Search Trees
- AVL Trees
- Red-Black Trees

### 2. Graphs
Graphs are non-linear data structures consisting of vertices (nodes) and edges.

**Types:**
- Directed Graphs
- Undirected Graphs
- Weighted Graphs

### 3. Hash Tables
Hash tables implement an associative array abstract data type, a structure that can map keys to values.

**Key Features:**
- Constant-time average case operations
- Collision handling
- Hash functions
`,
  problems: [
    {
      id: "ds-1",
      question: "Implement a function to reverse a linked list",
      steps: [
        "Initialize three pointers: prev = null, current = head, next = null",
        "Traverse the list while current is not null",
        "Store the next node: next = current.next",
        "Reverse the link: current.next = prev",
        "Move pointers: prev = current, current = next",
        "Return prev as the new head",
      ],
      hints: [
        "Think about how to change the direction of links",
        "Remember to handle the head node specially",
        "Consider edge cases like empty list or single node",
      ],
      solution: "The reversed linked list will have all pointers pointing in the opposite direction",
      relatedTopics: ["Linked Lists", "Pointers", "Iteration"],
    },
  ],
  practiceSets: [
    {
      id: "ds-p1",
      type: "mcq",
      question: "What is the time complexity of searching in a binary search tree?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      answer: "O(log n)",
    },
    {
      id: "ds-p2",
      type: "short-answer",
      question: "Explain the difference between a stack and a queue data structure.",
    },
  ],
  summary: {
    keyTakeaways: [
      "Data structures are fundamental to efficient algorithm design",
      "Different data structures have different strengths and use cases",
      "Understanding time complexity helps in choosing the right data structure",
      "Basic data structures can be combined to create more complex ones",
    ],
    observations: [
      "Array operations are generally faster for random access",
      "Linked lists are better for frequent insertions and deletions",
      "Trees are ideal for hierarchical data representation",
      "Hash tables provide the fastest average-case operations",
    ],
  },
};

export function LearningContentPanel({ content, onSaveQuestion }: LearningContentPanelProps) {
  const [selectedSection, setSelectedSection] = useState<string>("concept");
  const [expandedProblems, setExpandedProblems] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; text: string } | null>(null);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const { addMessage, setLoading } = useChatStore();
  const { activeCourse } = useCoursesStore();
  const { activeSection } = useSectionsStore();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async (message: string) => {
      setLoading(true);
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
      addMessage({
        role: "assistant",
        content: data.message_content,
      });
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
          variant={selectedSection === "problems" ? "default" : "ghost"}
          onClick={() => setSelectedSection("problems")}
        >
          <Brain className="w-4 h-4 mr-2" />
          Problems
        </Button>
        <Button
          variant={selectedSection === "practice" ? "default" : "ghost"}
          onClick={() => setSelectedSection("practice")}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Practice
        </Button>
        <Button
          variant={selectedSection === "summary" ? "default" : "ghost"}
          onClick={() => setSelectedSection("summary")}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Summary
        </Button>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1 p-8">
        {selectedSection === "concept" && (
          <div className="space-y-6">
            {/* Concept Explanation Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Concept Explanation</h3>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <Markdown
                  components={{
                    h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 text-primary">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-bold mb-4 text-primary">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-medium mb-3 text-primary">{children}</h3>,
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
                  }}
                >
                  {exampleContent.conceptExplanation}
                </Markdown>
              </div>
            </div>
          </div>
        )}

        {selectedSection === "problems" && (
          <div className="space-y-6">
            {content.problems.map((problem) => (
              <Card key={problem.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Problem {problem.id}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSaveQuestion?.(problem.id)}
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="font-medium">{problem.question}</p>

                    <Accordion
                      type="single"
                      collapsible
                      value={expandedProblems.includes(problem.id) ? problem.id : undefined}
                      onValueChange={(value) => {
                        setExpandedProblems(
                          value ? [...expandedProblems, value] : expandedProblems.filter((id) => id !== value),
                        );
                      }}
                    >
                      <AccordionItem value={problem.id}>
                        <AccordionTrigger className="text-primary">Solution Steps</AccordionTrigger>
                        <AccordionContent>
                          <ol className="list-decimal pl-6 space-y-2">
                            {problem.steps.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Hints</h4>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Brain className="w-4 h-4 mr-2" />
                            View Hints
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-primary text-primary-foreground">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">
                                Hint {activeHintIndex + 1} of {problem.hints.length}
                              </h4>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setActiveHintIndex((prev) => Math.max(0, prev - 1))}
                                  disabled={activeHintIndex === 0}
                                  className="text-primary-foreground hover:bg-primary-foreground/10"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (activeHintIndex === problem.hints.length - 1) {
                                      setActiveHintIndex(0);
                                    } else {
                                      setActiveHintIndex((prev) => Math.min(problem.hints.length - 1, prev + 1));
                                    }
                                  }}
                                  className="text-primary-foreground hover:bg-primary-foreground/10"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-primary-foreground/90">{problem.hints[activeHintIndex]}</p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                      onClick={() => {
                        const courseCode = activeCourse;
                        const syllabusCode = activeSection;
                        window.location.href = `/courses/${courseCode}/learn/${syllabusCode}/practice`;
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Practice
                    </Button>
                  </div>

                  {/* Practice History */}
                  <div>
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                      <History className="w-4 h-4" />
                      Practice History
                    </h4>
                    <div className="space-y-4">
                      {[
                        {
                          date: "2024-04-15",
                          score: 85,
                          completed: true,
                          timeSpent: "15 minutes",
                        },
                        {
                          date: "2024-04-14",
                          score: 70,
                          completed: true,
                          timeSpent: "12 minutes",
                        },
                        {
                          date: "2024-04-13",
                          score: 65,
                          completed: true,
                          timeSpent: "10 minutes",
                        },
                      ].map((history, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">Practice Session {index + 1}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(history.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-medium">{history.score}%</div>
                              <div className="text-sm text-muted-foreground">{history.timeSpent}</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const courseCode = activeCourse;
                                const syllabusCode = activeSection;
                                window.location.href = `/courses/${courseCode}/learn/${syllabusCode}/practice?session=${
                                  index + 1
                                }`;
                              }}
                            >
                              Review
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedSection === "summary" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Takeaways</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {content.summary.keyTakeaways.map((takeaway, index) => (
                    <li
                      key={index}
                      className="text-muted-foreground"
                    >
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Observations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {content.summary.observations.map((observation, index) => (
                    <li
                      key={index}
                      className="text-muted-foreground"
                    >
                      {observation}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center gap-4">
              <Button
                variant="outline"
                asChild
              >
                <Link href={`/courses/${activeCourse}/learn/previous-syllabus`}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  asChild
                >
                  <Link href={`/courses/${activeCourse}/learn/${activeSection}/quiz`}>
                    <Brain className="mr-2 h-4 w-4" />
                    Take Quiz
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                >
                  <Link href={`/courses/${activeCourse}/learn/${activeSection}`}>
                    <Home className="mr-2 h-4 w-4" />
                    Back to Syllabus
                  </Link>
                </Button>
              </div>
              <Button
                variant="outline"
                asChild
              >
                <Link href={`/courses/${activeCourse}/learn/next-syllabus`}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>

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
