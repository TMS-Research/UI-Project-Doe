"use client";

import axiosInstance from "@/app/api/axios";
import { LearningContentPanel } from "@/components/LearningContentPanel";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { sampleLearningContent } from "@/data/sample-learning-content";
import { useCoursesStore } from "@/stores/courses-store";
import { useSectionsStore } from "@/stores/sections-store";
import { SyllabusContent } from "@/types/api/syllabus.dto";
import { useQuery } from "@tanstack/react-query";
import { Book, CheckCircle, Clock, Brain, BookOpen, Sparkles, Target } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Define types for content items
interface TextContent {
  type: "text";
  content: string;
}

interface ListContent {
  type: "list";
  items: string[];
}

type ContentItem = TextContent | ListContent;

interface SyllabusItem {
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  progress: number;
  completed: boolean;
  content: ContentItem[];
  nextLesson: string | null;
  prevLesson: string | null;
}

// Dummy data for syllabus content
const syllabusContent: Record<string, SyllabusItem> = {
  "1.1": {
    title: "Course Overview",
    subtitle: "Introduction to Computer Science Fundamentals",
    description:
      "This chapter provides a comprehensive overview of the course, its objectives, and what you'll learn throughout the semester.",
    duration: "15 minutes",
    progress: 100,
    completed: true,
    content: [
      {
        type: "text",
        content:
          "Welcome to CS101: Introduction to Computer Science. This course is designed to provide you with a solid foundation in computer science principles and programming concepts.",
      },
      {
        type: "text",
        content:
          "Throughout this course, you'll learn about algorithms, data structures, programming paradigms, and problem-solving techniques that are essential for any aspiring computer scientist or software developer.",
      },
      {
        type: "text",
        content:
          "The course is structured into four main chapters, each focusing on different aspects of computer science. By the end of this course, you should be able to write basic programs, understand fundamental algorithms, and have a good grasp of computer science concepts.",
      },
    ],
    nextLesson: "1.2",
    prevLesson: null,
  },
  "1.2": {
    title: "Learning Objectives",
    subtitle: "What You'll Learn in This Course",
    description:
      "This section outlines the specific learning objectives and skills you'll acquire by completing this course.",
    duration: "20 minutes",
    progress: 75,
    completed: false,
    content: [
      {
        type: "text",
        content: "By the end of this course, you should be able to:",
      },
      {
        type: "list",
        items: [
          "Understand and explain fundamental computer science concepts",
          "Write and debug simple programs in a high-level programming language",
          "Analyze basic algorithms and their efficiency",
          "Design simple data structures to solve problems",
          "Apply problem-solving techniques to computational problems",
        ],
      },
      {
        type: "text",
        content:
          "These objectives are designed to give you a strong foundation in computer science that you can build upon in more advanced courses.",
      },
    ],
    nextLesson: "1.3",
    prevLesson: "1.1",
  },
  "1.3": {
    title: "Course Requirements",
    subtitle: "What You Need to Succeed",
    description: "This section details the prerequisites, materials, and assessment methods for the course.",
    duration: "25 minutes",
    progress: 0,
    completed: false,
    content: [
      {
        type: "text",
        content: "To succeed in this course, you'll need:",
      },
      {
        type: "list",
        items: [
          "Basic familiarity with computers and the internet",
          "Access to a computer with internet connectivity",
          "A text editor or IDE for programming",
          "Dedication to complete assignments and participate in discussions",
        ],
      },
      {
        type: "text",
        content: "Course assessment will be based on:",
      },
      {
        type: "list",
        items: [
          "Weekly programming assignments (40%)",
          "Midterm exam (20%)",
          "Final project (25%)",
          "Participation in discussions (15%)",
        ],
      },
    ],
    nextLesson: "2.1",
    prevLesson: "1.2",
  },
  "2.1": {
    title: "Basic Principles",
    subtitle: "Foundations of Computer Science",
    description: "This chapter introduces the fundamental principles that form the basis of computer science.",
    duration: "30 minutes",
    progress: 0,
    completed: false,
    content: [
      {
        type: "text",
        content:
          "Computer science is built on several fundamental principles that have remained constant despite the rapid evolution of technology.",
      },
      {
        type: "text",
        content:
          "These principles include abstraction, decomposition, pattern recognition, and algorithm design. Understanding these concepts is crucial for becoming proficient in computer science.",
      },
      {
        type: "text",
        content:
          "In this chapter, we'll explore each of these principles in detail and see how they apply to real-world problems.",
      },
    ],
    nextLesson: "2.2",
    prevLesson: "1.3",
  },
};

export default function LearnPage() {
  const params = useParams();
  const syllabusCode = params["syllabus-code"] as string;
  const courseCode = params["course-code"] as string;
  const [showLearningPathDialog, setShowLearningPathDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const { setActiveSection } = useSectionsStore();
  const { setActiveCourse, activeCourse } = useCoursesStore();

  const { data: content } = useQuery<SyllabusContent>({
    queryKey: ["content", courseCode],
    queryFn: async () => {
      const response = await axiosInstance.get(`/courses/${activeCourse?.id}/sections/${syllabusCode}`);
      return response.data;
    },
    enabled: !!courseCode && !!syllabusCode,
  });

  useEffect(() => {
    setActiveSection(syllabusCode);
    setActiveCourse(courseCode as string);

    // Show the learning path dialog when the page loads
    // setShowLearningPathDialog(true);
  }, [syllabusCode, setActiveSection, setActiveCourse, courseCode]);

  const loadingMessages = [
    {
      message: "Preparing your personalized learning experience...",
      submessage: "Analyzing your learning preferences and course requirements",
      icon: <Target className="h-8 w-8 text-primary-foreground" />,
    },
    {
      message: "Generating course content...",
      submessage: "Creating tailored learning materials based on your needs",
      icon: <BookOpen className="h-8 w-8 text-primary-foreground" />,
    },
    {
      message: "Personalizing your learning path...",
      submessage: "Adapting content to match your learning style and pace",
      icon: <Brain className="h-8 w-8 text-primary-foreground" />,
    },
    {
      message: "Almost ready! Finalizing your course...",
      submessage: "Just a moment while we set up your learning environment",
      icon: <Sparkles className="h-8 w-8 text-primary-foreground" />,
    },
  ];

  const handleStartSession = async () => {
    setIsLoading(true);
    setLoadingStep(0);

    // Simulate loading steps with different messages
    for (let i = 0; i < loadingMessages.length; i++) {
      setLoadingStep(i);
      // Wait for 2 seconds at each step
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    setIsLoading(false);
    setShowContent(true);
  };

  if (showContent) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        {/* Course Header */}
        <div className="bg-background rounded-xl p-6 shadow">
          <div className="flex flex-col gap-4">
            <div>
              <div className="inline-flex px-2 py-1 rounded-full text-sm bg-primary/10 text-primary mb-2">
                {syllabusCode}
              </div>
              <h1 className="text-2xl font-bold">{content?.title || "Data Structures and Algorithms"}</h1>
              <p className="text-muted-foreground">
                {content?.subtitle || "Understanding fundamental data structures and their applications"}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{content?.duration || "45 minutes"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Book className="h-4 w-4" />
                <span>Chapter {content?.chapter || "1"}</span>
              </div>
              {content?.completed && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Completed</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">Progress</div>
              <div className="flex-1">
                <Progress value={content?.progress || 0} />
              </div>
              <div className="text-sm font-medium">{content?.progress || 0}%</div>
            </div>
          </div>
        </div>

        {/* Learning Content Panel */}
        <div className="bg-background rounded-xl shadow">
          <LearningContentPanel
            content={sampleLearningContent}
            onSaveQuestion={(questionId) => {
              // TODO: Implement save question functionality
              console.log("Saving question:", questionId);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <LoadingOverlay
          message={loadingMessages[loadingStep].message}
          submessage={loadingMessages[loadingStep].submessage}
          icon={loadingMessages[loadingStep].icon}
          progress={((loadingStep + 1) / loadingMessages.length) * 100}
        />
      )}

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative overflow-hidden rounded-2xl w-full max-w-2xl bg-primary">
          {/* Content */}
          <div className="px-8 py-12 sm:px-12 sm:py-16">
            <div className="max-w-2xl space-y-6 flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Ready to Start Learning?</h1>
              <p className="text-xl text-gray-100 text-center">
                Begin this section to dive into the course material and start your learning journey.
              </p>
              <Button
                size="lg"
                variant={"secondary"}
                onClick={handleStartSession}
                disabled={isLoading}
              >
                {isLoading ? "Preparing..." : "Start Session"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
