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
import { Book, BookOpen, Brain, CheckCircle, Clock, Sparkles, Target } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LearnPage() {
  const params = useParams();
  const syllabusCode = params["syllabus-code"] as string;
  const courseCode = params["course-code"] as string;
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
