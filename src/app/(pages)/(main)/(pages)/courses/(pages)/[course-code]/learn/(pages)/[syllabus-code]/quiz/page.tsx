"use client";

import { useParams } from "next/navigation";
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

// Quiz question types
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
}

// Quiz state
interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, number>;
  isSubmitted: boolean;
  score: number;
  timeRemaining: number;
  showFeedback: boolean;
  selectedAnswer: number | null;
}

export default function QuizPage() {
  const params = useParams();
  const syllabusCode = params["syllabus-code"] as string;
  const courseCode = params["course-code"] as string;

  const { setActiveSection } = useSectionsStore();
  const { setActiveCourse } = useCoursesStore();

  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    isSubmitted: false,
    score: 0,
    timeRemaining: 30,
    showFeedback: false,
    selectedAnswer: null,
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

  // Dummy quiz questions based on syllabus content
  const quizQuestions: QuizQuestion[] = [
    {
      id: "q1",
      question: "What is the main topic of this syllabus?",
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
      id: "q2",
      question:
        "Which of the following fundamental computer science principles is NOT covered in this introductory syllabus section on basic principles and concepts?",
      options: ["Basic Programming Concepts", "Data Structures", "Machine Learning", "Problem Solving Techniques"],
      correctAnswer: 2,
      explanation: "Machine Learning is not covered in this introductory syllabus.",
      hint: "This is an advanced topic that would typically be covered in later courses.",
    },
    {
      id: "q3",
      question: "How long is this syllabus section expected to take?",
      options: ["15 minutes", "30 minutes", "1 hour", "2 hours"],
      correctAnswer: 0,
      explanation: "This syllabus section is designed to take approximately 15 minutes to complete.",
      hint: "Check the duration information in the syllabus header.",
    },
  ];

  useEffect(() => {
    setActiveSection(syllabusCode);
    setActiveCourse(courseCode);
  }, [syllabusCode, setActiveSection, setActiveCourse, courseCode]);

  // Timer effect
  useEffect(() => {
    if (quizState.isSubmitted || !quizState.answers[quizQuestions[quizState.currentQuestionIndex].id]) return;

    const timer = setInterval(() => {
      setQuizState((prev) => {
        if (prev.timeRemaining <= 0) {
          clearInterval(timer);
          return {
            ...prev,
            timeRemaining: 30,
            showFeedback: true,
          };
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState.currentQuestionIndex, quizState.isSubmitted, quizState.answers, quizQuestions]);

  // Reset timer when moving to next question
  useEffect(() => {
    setQuizState((prev) => ({
      ...prev,
      timeRemaining: 30,
      showFeedback: false,
    }));
  }, [quizState.currentQuestionIndex]);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    if (quizState.isSubmitted) return;

    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answerIndex,
      },
      showFeedback: true,
      selectedAnswer: answerIndex,
    }));

    // Show feedback toast
    const currentQuestion = quizQuestions[quizState.currentQuestionIndex];
    if (answerIndex === currentQuestion.correctAnswer) {
      toast.success("Correct!", {
        description: currentQuestion.explanation,
      });
    } else {
      toast.error("Incorrect", {
        description: `The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}`,
      });
    }
  };

  const handleNextQuestion = () => {
    if (quizState.currentQuestionIndex < quizQuestions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        timeRemaining: 30,
        showFeedback: false,
        selectedAnswer: null,
      }));
    }
  };

  const handlePrevQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate score
    let correctAnswers = 0;
    quizQuestions.forEach((question) => {
      if (quizState.answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quizQuestions.length) * 100);

    setQuizState((prev) => ({
      ...prev,
      isSubmitted: true,
      score,
    }));

    // Show toast with score
    if (score >= 70) {
      toast.success(`Congratulations! You scored ${score}%`, {
        description: "You've successfully completed the quiz.",
      });
    } else {
      toast.error(`You scored ${score}%`, {
        description: "You need at least 70% to pass. Try reviewing the content and taking the quiz again.",
      });
    }
  };

  const currentQuestion = quizQuestions[quizState.currentQuestionIndex];
  const progress = ((quizState.currentQuestionIndex + 1) / quizQuestions.length) * 100;
  const allQuestionsAnswered = Object.keys(quizState.answers).length === quizQuestions.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Quiz Header */}
      <div className="bg-background rounded-xl p-6 shadow">
        <div className="flex flex-col gap-4">
          <div>
            <div className="inline-flex px-2 py-1 rounded-full text-sm bg-primary/10 text-primary mb-2">
              Quiz: {content?.title}
            </div>
            <h1 className="text-2xl font-bold">Test Your Knowledge</h1>
            <p className="text-muted-foreground">Answer the following questions to test your understanding</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{quizQuestions.length} questions</span>
            </div>
            <div className="flex items-center gap-1">
              <Book className="h-4 w-4" />
              <span>Chapter {content?.chapter}</span>
            </div>
            {quizState.isSubmitted && (
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
            <div className="text-sm font-medium">{Math.round(progress)}%</div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      {!quizState.isSubmitted ? (
        <Card>
          <CardHeader className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <CardDescription>
                Question {quizState.currentQuestionIndex + 1} of {quizQuestions.length}
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
          <CardContent className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  quizState.answers[currentQuestion.id] === index
                    ? index === currentQuestion.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : index === currentQuestion.correctAnswer && quizState.showFeedback
                    ? "border-green-500 bg-green-50"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => handleAnswerSelect(currentQuestion.id, index)}
              >
                {option}
                {quizState.showFeedback && (
                  <div className="mt-2 text-sm">
                    {index === currentQuestion.correctAnswer ? (
                      <span className="text-green-600">✓ Correct answer</span>
                    ) : quizState.answers[currentQuestion.id] === index ? (
                      <span className="text-red-600">✗ Incorrect answer</span>
                    ) : null}
                  </div>
                )}
              </div>
            ))}

            {/* Explanation section that appears after answer selection */}
            {quizState.showFeedback && (
              <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
                <h3 className="font-medium text-primary mb-2">Explanation:</h3>
                <p className="text-sm">{currentQuestion.explanation}</p>

                {quizState.selectedAnswer !== currentQuestion.correctAnswer && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <h4 className="font-medium text-red-600 mb-1">Correct answer:</h4>
                    <p className="text-sm">{currentQuestion.options[currentQuestion.correctAnswer]}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={quizState.currentQuestionIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {quizState.currentQuestionIndex < quizQuestions.length - 1 ? (
              <Button
                onClick={handleNextQuestion}
                disabled={!quizState.answers[currentQuestion.id]}
              >
                Next
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmitQuiz}
                disabled={!allQuestionsAnswered}
              >
                Submit Quiz
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>You scored {quizState.score}%</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {quizQuestions.map((question, index) => (
              <div
                key={question.id}
                className="space-y-2"
              >
                <h3 className="font-medium">
                  Question {index + 1}: {question.question}
                </h3>
                <div className="pl-4 space-y-1">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-2 rounded ${
                        optionIndex === question.correctAnswer
                          ? "bg-green-100 text-green-800"
                          : optionIndex === quizState.answers[question.id] && optionIndex !== question.correctAnswer
                          ? "bg-red-100 text-red-800"
                          : ""
                      }`}
                    >
                      {option}
                      {optionIndex === question.correctAnswer && <span className="ml-2 text-green-600">✓ Correct</span>}
                      {optionIndex === quizState.answers[question.id] && optionIndex !== question.correctAnswer && (
                        <span className="ml-2 text-red-600">✗ Incorrect</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">Explanation:</p>
                  <p className="text-sm">{question.explanation}</p>
                </div>
                <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-md">
                  <p className="text-sm font-medium text-primary">Hint:</p>
                  <p className="text-sm">{question.hint}</p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              asChild
            >
              <Link href={`/courses/${courseCode}/learn/${syllabusCode}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Syllabus
              </Link>
            </Button>
            <Button
              onClick={() =>
                setQuizState({
                  currentQuestionIndex: 0,
                  answers: {},
                  isSubmitted: false,
                  score: 0,
                  timeRemaining: 30,
                  showFeedback: false,
                  selectedAnswer: null,
                })
              }
            >
              Retake Quiz
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
