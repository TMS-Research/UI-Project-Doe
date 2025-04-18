"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, CheckCircle, Clock, Book, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/api/axios";
import { useEffect, useState } from "react";
import { useSectionsStore } from "@/stores/sections-store";
import { useCoursesStore } from "@/stores/courses-store";
import { SyllabusContent } from "@/types/api/syllabus.dto";
import { toast } from "sonner";

// Practice question types
interface PracticeQuestion {
  id: string;
  question: string;
  type: "mcq" | "short-answer" | "essay";
  options?: string[];
  correctAnswer?: number;
  explanation: string;
  hint: string;
}

// Practice state
interface PracticeState {
  currentQuestionIndex: number;
  answers: Record<string, string | number>;
  isSubmitted: boolean;
  score: number;
  timeSpent: number;
  showFeedback: boolean;
}

export default function PracticePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const syllabusCode = params["syllabus-code"] as string;
  const courseCode = params["course-code"] as string;
  const sessionId = searchParams.get("session");

  const { setActiveSection } = useSectionsStore();
  const { setActiveCourse } = useCoursesStore();

  const [practiceState, setPracticeState] = useState<PracticeState>({
    currentQuestionIndex: 0,
    answers: {},
    isSubmitted: false,
    score: 0,
    timeSpent: 0,
    showFeedback: false,
  });

  // Fetch syllabus content
  const { data: content } = useQuery<SyllabusContent>({
    queryKey: ["content", courseCode, syllabusCode],
    queryFn: async () => {
      const response = await axiosInstance.get(`/courses/${courseCode}/sections/${syllabusCode}`);
      return response.data;
    },
    enabled: !!courseCode && !!syllabusCode,
  });

  // Dummy practice questions based on syllabus content
  const practiceQuestions: PracticeQuestion[] = [
    {
      id: "p1",
      question: "What is the main topic of this syllabus?",
      type: "mcq",
      options: [
        "Introduction to Computer Science",
        "Advanced Programming Techniques",
        "Data Structures and Algorithms",
        "Web Development Fundamentals",
      ],
      correctAnswer: 0,
      explanation: "This syllabus covers the fundamentals of Computer Science as an introduction to the subject.",
      hint: "Look at the subtitle of the syllabus section for a clue.",
    },
    {
      id: "p2",
      question: "Explain the concept of data structures in your own words.",
      type: "essay",
      explanation: "Data structures are specialized formats for organizing, processing, retrieving, and storing data.",
      hint: "Think about how data is organized and accessed in computer programs.",
    },
    {
      id: "p3",
      question: "What is the time complexity of searching in a binary search tree?",
      type: "short-answer",
      explanation: "The time complexity of searching in a binary search tree is O(log n) in the average case.",
      hint: "Consider how the search space is divided in each step.",
    },
  ];

  useEffect(() => {
    setActiveSection(syllabusCode);
    setActiveCourse(courseCode);
  }, [syllabusCode, setActiveSection, setActiveCourse, courseCode]);

  // Timer effect
  useEffect(() => {
    if (practiceState.isSubmitted) return;

    const timer = setInterval(() => {
      setPracticeState((prev) => ({
        ...prev,
        timeSpent: prev.timeSpent + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [practiceState.isSubmitted]);

  const handleAnswerSubmit = (questionId: string, answer: string | number) => {
    if (practiceState.isSubmitted) return;

    setPracticeState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
      showFeedback: true,
    }));

    const currentQuestion = practiceQuestions[practiceState.currentQuestionIndex];
    if (currentQuestion.type === "mcq" && answer === currentQuestion.correctAnswer) {
      toast.success("Correct!", {
        description: currentQuestion.explanation,
      });
    }
  };

  const handleNextQuestion = () => {
    if (practiceState.currentQuestionIndex < practiceQuestions.length - 1) {
      setPracticeState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showFeedback: false,
      }));
    }
  };

  const handlePrevQuestion = () => {
    if (practiceState.currentQuestionIndex > 0) {
      setPracticeState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const handleSubmitPractice = () => {
    // Calculate score based on MCQ answers only
    let correctAnswers = 0;
    let totalMCQ = 0;

    practiceQuestions.forEach((question) => {
      if (question.type === "mcq") {
        totalMCQ++;
        if (practiceState.answers[question.id] === question.correctAnswer) {
          correctAnswers++;
        }
      }
    });

    const score = totalMCQ > 0 ? Math.round((correctAnswers / totalMCQ) * 100) : 0;

    setPracticeState((prev) => ({
      ...prev,
      isSubmitted: true,
      score,
    }));

    // Show toast with score
    toast.success(`Practice completed!`, {
      description: `You spent ${Math.floor(practiceState.timeSpent / 60)} minutes on this practice session.`,
    });
  };

  const currentQuestion = practiceQuestions[practiceState.currentQuestionIndex];
  const progress = ((practiceState.currentQuestionIndex + 1) / practiceQuestions.length) * 100;
  const allQuestionsAnswered = Object.keys(practiceState.answers).length === practiceQuestions.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Practice Header */}
      <div className="bg-background rounded-xl p-6 shadow">
        <div className="flex flex-col gap-4">
          <div>
            <div className="inline-flex px-2 py-1 rounded-full text-sm bg-primary/10 text-primary mb-2">
              Practice: {content?.title}
            </div>
            <h1 className="text-2xl font-bold">Practice Questions</h1>
            <p className="text-muted-foreground">Test your understanding with these practice questions</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{practiceQuestions.length} questions</span>
            </div>
            <div className="flex items-center gap-1">
              <Book className="h-4 w-4" />
              <span>Chapter {content?.chapter}</span>
            </div>
            {practiceState.isSubmitted && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Completed</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Progress</div>
            <div className="flex-1">
              <Progress value={progress} />
            </div>
          </div>
        </div>
      </div>

      {/* Practice Content */}
      {!practiceState.isSubmitted ? (
        <Card>
          <CardHeader className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <CardDescription>
                Question {practiceState.currentQuestionIndex + 1} of {practiceQuestions.length}
              </CardDescription>
              <CardTitle className="text-xl leading-8">{currentQuestion.question}</CardTitle>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-fit text-primary"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Hint
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium text-primary">Hint</h4>
                  <p className="text-sm">{currentQuestion.hint}</p>
                </div>
              </PopoverContent>
            </Popover>
          </CardHeader>
          <CardContent>
            {currentQuestion.type === "mcq" && currentQuestion.options && (
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      practiceState.answers[currentQuestion.id] === index
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => handleAnswerSubmit(currentQuestion.id, index)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.type === "short-answer" && (
              <textarea
                className="w-full p-2 border rounded-lg"
                rows={3}
                placeholder="Enter your answer here..."
                value={(practiceState.answers[currentQuestion.id] as string) || ""}
                onChange={(e) => handleAnswerSubmit(currentQuestion.id, e.target.value)}
              />
            )}

            {currentQuestion.type === "essay" && (
              <textarea
                className="w-full p-2 border rounded-lg"
                rows={6}
                placeholder="Write your essay here..."
                value={(practiceState.answers[currentQuestion.id] as string) || ""}
                onChange={(e) => handleAnswerSubmit(currentQuestion.id, e.target.value)}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={practiceState.currentQuestionIndex === 0}
            >
              Previous
            </Button>
            {practiceState.currentQuestionIndex === practiceQuestions.length - 1 ? (
              <Button
                onClick={handleSubmitPractice}
                disabled={!allQuestionsAnswered}
              >
                Submit Practice
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>Next</Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Practice Complete!</CardTitle>
            <CardDescription>Here&apos;s a summary of your practice session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Time Spent</span>
                <span className="font-medium">{Math.floor(practiceState.timeSpent / 60)} minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Score</span>
                <span className="font-medium">{practiceState.score}%</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() =>
                setPracticeState({
                  currentQuestionIndex: 0,
                  answers: {},
                  isSubmitted: false,
                  score: 0,
                  timeSpent: 0,
                  showFeedback: false,
                })
              }
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
