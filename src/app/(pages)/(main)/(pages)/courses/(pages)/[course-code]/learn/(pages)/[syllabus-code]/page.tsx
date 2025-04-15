"use client";

import { useParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Book, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/api/axios";
import { useEffect } from "react";
import { useSectionsStore } from "@/stores/sections-store";
import { useCoursesStore } from "@/stores/courses-store";
import { SyllabusContent } from "@/types/api/syllabus.dto";

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

  const { setActiveSection } = useSectionsStore();
  const { setActiveCourse } = useCoursesStore();

  const { data: content } = useQuery<SyllabusContent>({
    queryKey: ["content", courseCode],
    queryFn: async () => {
      const response = await axiosInstance.get(`/courses/${courseCode}/sections/${syllabusCode}`);
      return response.data;
    },
    enabled: !!courseCode && !!syllabusCode,
  });

  useEffect(() => {
    setActiveSection(syllabusCode);
    setActiveCourse(courseCode as string);
  }, [syllabusCode, setActiveSection, setActiveCourse, courseCode]);

  // Get the content for the current syllabus code
  // const content = syllabusContent[syllabusCode as keyof typeof syllabusContent] || {
  //   title: "Content Not Found",
  //   subtitle: "This section is under development",
  //   description: "The content you're looking for is not available yet.",
  //   duration: "0 minutes",
  //   progress: 0,
  //   completed: false,
  //   content: [
  //     {
  //       type: "text",
  //       content: "This content is currently being developed. Please check back later.",
  //     },
  //   ],
  //   nextLesson: null,
  //   prevLesson: null,
  // };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Course Header */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex flex-col gap-4">
          <div>
            <div className="inline-flex px-2 py-1 rounded-full text-sm bg-primary/10 text-primary mb-2">
              {syllabusCode}
            </div>
            <h1 className="text-2xl font-bold">{content?.title}</h1>
            <p className="text-muted-foreground">{content?.subtitle}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{content?.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Book className="h-4 w-4" />
              <span>Chapter {content?.chapter}</span>
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
              <Progress value={content?.progress} />
            </div>
            <div className="text-sm font-medium">{content?.progress}%</div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="bg-white rounded-xl p-6 shadow space-y-2">
        <h2 className="text-xl font-semibold">Topics</h2>
        <p className="text-muted-foreground">{content?.description}</p>

        <div className="space-y-4">
          {content?.content.topics.map((item: string, index: number) => (
            <div
              key={index}
              className="inline-flex px-2 py-1 rounded-full text-sm bg-primary/10 text-primary mr-2 mb-2"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow space-y-2">
        <h2 className="text-xl font-semibold">Resources</h2>

        <div className="space-y-4">
          {content?.content.resources.map((item: string, index: number) => (
            <div
              key={index}
              className="inline-flex px-2 py-1 rounded-full text-sm bg-primary/10 text-primary mr-2 mb-2"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        {content?.prevLesson ? (
          <Button
            asChild
            variant="outline"
          >
            <Link
              href={`/courses/${courseCode}/learn/${content?.prevLesson}`}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous: {syllabusContent[content.prevLesson as keyof typeof syllabusContent]?.title}</span>
            </Link>
          </Button>
        ) : (
          <div></div>
        )}

        {content?.nextLesson ? (
          <Button asChild>
            <Link
              href={`/courses/CS101/learn/${content?.nextLesson}`}
              className="flex items-center gap-2"
            >
              <span>Next: {syllabusContent[content?.nextLesson as keyof typeof syllabusContent]?.title}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link
              href="/courses/CS101/corridor"
              className="flex items-center gap-2"
            >
              <span>Return to Course</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
