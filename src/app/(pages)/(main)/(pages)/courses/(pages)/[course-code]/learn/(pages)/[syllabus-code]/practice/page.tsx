"use client";

import axiosInstance from "@/app/api/axios";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useCoursesStore } from "@/stores/courses-store";
import usePracticeStore from "@/stores/practice-store";
import { useSectionsStore } from "@/stores/sections-store";
import { SyllabusContent } from "@/types/api/syllabus.dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Book, CheckCircle, Clock, HelpCircle, Trophy, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Practice question types
interface PracticeQuestion {
  id: string;
  question_text: string;
  question_type: "mcq" | "short_answer" | "essay";
  answer_options?: string[];
  correct_answer: string;
  explanation: string;
  hints: string[];
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  hint_type: string;
  media_url: string | null;
  course_id: string;
  section_id: string;
  created_at: string;
  updated_at: string | null;
}

// Practice state
interface PracticeState {
  currentQuestionIndex: number;
  currentHintIndex: number;
  answers: Record<string, string | number>;
  isSubmitted: boolean;
  score: number;
  timeSpent: number;
  showFeedback: boolean;
  isAnswerChecked: boolean;
  isCheckingAnswer: boolean;
}

interface AnswerResponse {
  question_id: string;
  is_correct: boolean;
  correct_answer: string;
  explanation: string;
  feedback: string;
  additional_resources: string[];
}

interface PracticeResults {
  session_id: string;
  session_score: number;
  session_date: string;
  total_questions: number;
  correct_answers: number;
  results: {
    question_id: string;
    question_text: string;
    question_type: string;
    explanation: string;
    answer_options: string[];
    correct_answer: string;
    user_answer: string;
    is_correct: boolean;
  }[];
}

export default function PracticePage() {
  const { activeSection } = useSectionsStore();
  const { activeCourse } = useCoursesStore();
  const { practiceSessionId } = usePracticeStore();
  const router = useRouter();

  const [practiceState, setPracticeState] = useState<PracticeState>({
    currentQuestionIndex: 0,
    currentHintIndex: 0,
    answers: {},
    isSubmitted: false,
    score: 0,
    timeSpent: 0,
    showFeedback: false,
    isAnswerChecked: false,
    isCheckingAnswer: false,
  });
  const [showHint, setShowHint] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [practiceResults, setPracticeResults] = useState<PracticeResults | null>(null);
  const [startTime] = useState<number>(Date.now());
  const [currentAnswerResponse, setCurrentAnswerResponse] = useState<AnswerResponse | null>(null);

  // Fetch syllabus content
  const { data: content } = useQuery<SyllabusContent>({
    queryKey: ["content", activeCourse?.id, activeSection],
    queryFn: async () => {
      const response = await axiosInstance.get(`/courses/${activeCourse?.id}/sections/${activeSection?.id}`);
      return response.data;
    },
    enabled: !!activeCourse?.id && !!activeSection,
  });

  // Fetch practice questions
  const { data: questions, isLoading: isLoadingQuestions } = useQuery<PracticeQuestion[]>({
    queryKey: ["practice-questions", activeCourse?.id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/practice/${activeCourse?.id}`);
      return response.data;
    },
    enabled: !!activeCourse?.id,
  });

  // Submit answer
  const { mutate: submitAnswer } = useMutation({
    mutationFn: async (data: { question_id: string; user_answer: string | number; time_taken_seconds: number }) => {
      const response = await axiosInstance.post(`/practice/answer`, {
        question_id: data.question_id,
        user_answer: data.user_answer,
        user_course_id: activeCourse?.id,
        time_taken_seconds: data.time_taken_seconds,
        practice_session_id: practiceSessionId,
      });
      return response.data as AnswerResponse;
    },
    onSuccess: (data) => {
      toast.success(data.is_correct ? "Correct!" : "Incorrect");

      // Store the answer response
      setCurrentAnswerResponse(data);

      // Update the practice state with the answer response
      setPracticeState((prev) => ({
        ...prev,
        isAnswerChecked: true,
        showFeedback: true,
        isCheckingAnswer: false,
      }));

      // If this is the last question, complete the session
      if (practiceState.currentQuestionIndex === (questions?.length || 0) - 1) {
        completeSession();
      }
    },
    onError: (error) => {
      toast.error("Failed to submit answer");
      console.error(error);
      // Reset loading state on error
      setPracticeState((prev) => ({
        ...prev,
        isCheckingAnswer: false,
      }));
    },
  });

  // Complete practice session
  const { mutate: completeSession } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(`/practice/session/${practiceSessionId}/complete`);
      return response.data;
    },
    onSuccess: () => {
      fetchPracticeResults();
    },
    onError: (error) => {
      toast.error("Failed to complete practice session");
      console.error(error);
    },
  });

  // Fetch practice results
  const { mutate: fetchPracticeResults } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get(`/practice/results`, {
        params: { practice_session_id: practiceSessionId },
      });
      return response.data as PracticeResults;
    },
    onSuccess: (data) => {
      setPracticeResults(data);
      setShowResults(true);
    },
    onError: (error) => {
      toast.error("Failed to fetch practice results");
      console.error(error);
    },
  });

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

  const handleAnswer = (questionId: string, answer: string | number) => {
    if (practiceState.isSubmitted) return;

    setPracticeState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
  };

  const handleAnswerSubmit = (questionId: string, answer: string | number) => {
    if (practiceState.isSubmitted) return;

    // Submit answer to the server
    const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);
    submitAnswer({
      question_id: questionId,
      user_answer: answer,
      time_taken_seconds: timeTakenSeconds,
    });
  };

  const handleCheckAnswer = () => {
    // Set loading state
    setPracticeState((prev) => ({
      ...prev,
      isCheckingAnswer: true,
    }));

    const currentQuestion = questions?.[practiceState.currentQuestionIndex];
    if (currentQuestion?.id) {
      handleAnswerSubmit(currentQuestion.id, practiceState.answers[currentQuestion.id] || "");
    }
  };

  const handleNextQuestion = () => {
    if (practiceState.currentQuestionIndex < (questions?.length ?? 0) - 1) {
      setPracticeState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        currentHintIndex: 0,
        isAnswerChecked: false,
        showFeedback: false,
        isCheckingAnswer: false,
      }));
      // Reset the current answer response when moving to the next question
      setCurrentAnswerResponse(null);
    }
  };

  const handleNextHint = () => {
    const currentQuestion = questions?.[practiceState.currentQuestionIndex];
    if (currentQuestion && practiceState.currentHintIndex < (currentQuestion.hints?.length || 0) - 1) {
      setPracticeState((prev) => ({
        ...prev,
        currentHintIndex: prev.currentHintIndex + 1,
      }));
    }
  };

  const handlePrevHint = () => {
    if (practiceState.currentHintIndex > 0) {
      setPracticeState((prev) => ({
        ...prev,
        currentHintIndex: prev.currentHintIndex - 1,
      }));
    }
  };

  const handleSubmitPractice = () => {
    // Calculate score based on MCQ answers only
    let correctAnswers = 0;
    let totalMCQ = 0;

    questions?.forEach((question) => {
      // Determine if it's an MCQ based on the presence of answer_options
      if (question.answer_options && question.answer_options.length > 0) {
        totalMCQ++;
        if (practiceState.answers[question.id] === question.correct_answer) {
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

  const currentQuestion = questions?.[practiceState.currentQuestionIndex];
  const progress = ((practiceState.currentQuestionIndex + 1) / (questions?.length ?? 0)) * 100;
  const allQuestionsAnswered = Object.keys(practiceState.answers).length === questions?.length;
  const hasCurrentAnswer = currentQuestion?.id ? currentQuestion.id in practiceState.answers : false;

  const handleToggleHint = () => {
    setShowHint(!showHint);
  };

  const handleBackToMainContent = () => {
    router.push(`/courses/${activeCourse?.code}/learn/${activeSection?.slug}`);
  };

  // Add loading and error states
  if (isLoadingQuestions || !questions) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 p-6 mt-12">
        <div className="bg-background rounded-xl p-6 shadow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Practice Questions</h1>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleBackToMainContent}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Main Content
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading practice questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && practiceResults) {
    return (
      <div className="container mx-auto py-8 mt-12">
        {/* Overview Card */}
        <Card className="mb-8">
          <CardHeader className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="inline-flex px-2 py-1 rounded-full text-sm bg-primary/10 text-primary mb-2">
                  Practice: {content?.title}
                </div>
                <h1 className="text-2xl font-bold">Practice Results</h1>
                <p className="text-muted-foreground">Review your answers and learn from your mistakes</p>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleBackToMainContent}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Main Content
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Book className="h-4 w-4" />
                <span>Chapter {content?.chapter}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{practiceResults.total_questions} questions</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>{practiceResults.correct_answers} correct</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Score</span>
                </div>
                <div className="text-3xl font-bold text-primary">{practiceResults.session_score}%</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Correct Answers</span>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {practiceResults.correct_answers}/{practiceResults.total_questions}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Time Taken</span>
                </div>
                <div className="text-3xl font-bold text-primary">{Math.floor(practiceState.timeSpent / 60)} min</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Review Card */}
        <Card>
          <CardHeader>
            <CardTitle>Questions Review</CardTitle>
            <CardDescription>Review all questions and their correct answers</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-4"
            >
              {practiceResults.results.map((result, index) => (
                <AccordionItem
                  key={result.question_id}
                  value={`question-${index}`}
                  className={`border rounded-lg overflow-hidden ${
                    result.is_correct
                      ? "border-muted bg-muted/5"
                      : "border-destructive/20 data-[state=closed]:bg-destructive/5"
                  }`}
                >
                  <AccordionTrigger className="hover:no-underline px-6 py-4">
                    <div className="flex items-center gap-2 text-left">
                      <span className="text-sm font-medium text-muted-foreground">Q{index + 1}.</span>
                      <span className="font-medium">{result.question_text}</span>
                      {result.is_correct ? (
                        <CheckCircle className="h-4 w-4 text-primary ml-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive ml-2" />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 bg-card">
                    <div className="space-y-4">
                      {/* Answer Options */}
                      {result.answer_options && result.answer_options.length > 0 && (
                        <div className="space-y-3">
                          {result.answer_options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`py-3 px-4 rounded-md border bg-muted/20 transition-all ${
                                option === result.correct_answer
                                  ? "border-primary bg-primary/15"
                                  : option === result.user_answer && option !== result.correct_answer
                                  ? "border-destructive bg-destructive/15"
                                  : "border-muted"
                              }`}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Explanation */}
                      <Card className="bg-muted/30 border-primary/40">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Book className="h-4 w-4 text-primary" />
                            <CardTitle className="text-sm font-medium text-primary">Explanation</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{result.explanation}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 mt-12">
      {/* Practice Header */}
      <div className="bg-background rounded-xl p-6 shadow">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="inline-flex px-2 py-1 rounded-full text-sm bg-primary/10 text-primary mb-2">
                Practice: {content?.title}
              </div>
              <h1 className="text-2xl font-bold">Practice Questions</h1>
              <p className="text-muted-foreground">Test your understanding with these practice questions</p>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleBackToMainContent}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Main Content
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{questions?.length} questions</span>
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
                Question {practiceState.currentQuestionIndex + 1} of {questions?.length}
              </CardDescription>
              <CardTitle className="text-xl leading-8">{currentQuestion?.question_text}</CardTitle>
            </div>
            <Button
              variant="outline"
              className="w-fit text-primary"
              onClick={handleToggleHint}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              {showHint ? "Hide Hint" : "Show Hint"}
            </Button>
          </CardHeader>

          {/* Hint Card */}
          {showHint && (
            <div className="px-6 mb-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-primary">Hint</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {practiceState.currentHintIndex + 1} of {currentQuestion?.hints?.length || 0}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm">{currentQuestion?.hints?.[practiceState.currentHintIndex]}</p>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handlePrevHint}
                    disabled={practiceState.currentHintIndex === 0}
                  >
                    Previous Hint
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleNextHint}
                    disabled={practiceState.currentHintIndex === (currentQuestion?.hints?.length || 0) - 1}
                  >
                    Next Hint
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          <CardContent>
            {/* Determine if it's an MCQ based on the presence of answer_options */}
            {currentQuestion?.answer_options && currentQuestion.answer_options.length > 0 ? (
              <div className="space-y-2">
                {currentQuestion.answer_options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-colors ${
                      practiceState.answers[currentQuestion?.id] === option
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    } ${practiceState.isAnswerChecked ? "cursor-default opacity-70" : "cursor-pointer"}`}
                    onClick={() => {
                      if (!practiceState.isAnswerChecked && currentQuestion?.id) {
                        handleAnswer(currentQuestion.id, option);
                      }
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            ) : (
              <Textarea
                className="w-full p-2 border rounded-lg"
                rows={3}
                placeholder="Enter your answer here..."
                value={currentQuestion?.id ? (practiceState.answers[currentQuestion.id] as string) || "" : ""}
                onChange={(e) => {
                  if (currentQuestion?.id) {
                    handleAnswer(currentQuestion.id, e.target.value);
                  }
                }}
                disabled={practiceState.isAnswerChecked}
              />
            )}

            {/* Feedback section */}
            {practiceState.isAnswerChecked && currentAnswerResponse && (
              <div className="mt-4 p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  {currentAnswerResponse.is_correct ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <h4 className="font-medium">Correct!</h4>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <XCircle className="h-4 w-4" />
                      <h4 className="font-medium">Incorrect!</h4>
                    </div>
                  )}
                </div>
                <h4 className="font-medium mb-2">Explanation:</h4>
                <p className="text-sm">{currentAnswerResponse.explanation}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            {practiceState.currentQuestionIndex === (questions?.length ?? 0) - 1 ? (
              practiceState.isAnswerChecked ? (
                <Button
                  onClick={handleSubmitPractice}
                  disabled={!allQuestionsAnswered}
                >
                  Submit Practice
                </Button>
              ) : (
                <Button
                  onClick={handleCheckAnswer}
                  disabled={!hasCurrentAnswer || practiceState.isCheckingAnswer}
                >
                  {practiceState.isCheckingAnswer ? (
                    <>
                      <span className="mr-2">Checking...</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    </>
                  ) : (
                    "Check Answer"
                  )}
                </Button>
              )
            ) : practiceState.isAnswerChecked ? (
              <Button onClick={handleNextQuestion}>Next</Button>
            ) : (
              <Button
                onClick={handleCheckAnswer}
                disabled={!hasCurrentAnswer || practiceState.isCheckingAnswer}
              >
                {practiceState.isCheckingAnswer ? (
                  <>
                    <span className="mr-2">Checking...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  </>
                ) : (
                  "Check Answer"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-8">
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
                    currentHintIndex: 0,
                    answers: {},
                    isSubmitted: false,
                    score: 0,
                    timeSpent: 0,
                    showFeedback: false,
                    isAnswerChecked: false,
                    isCheckingAnswer: false,
                  })
                }
              >
                Try Again
              </Button>
            </CardFooter>
          </Card>

          {/* Questions Review Accordion */}
          <Card>
            <CardHeader>
              <CardTitle>Questions Review</CardTitle>
              <CardDescription>Review all questions and their correct answers</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion
                type="single"
                collapsible
                className="w-full"
              >
                {questions?.map((question, index) => (
                  <AccordionItem
                    key={question.id}
                    value={`question-${index}`}
                  >
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Q{index + 1}.</span>
                        <span>{question.question_text}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {/* Question Type and Options */}
                        <div className="space-y-2">
                          {question.answer_options && question.answer_options.length > 0 && (
                            <div className="space-y-2">
                              {question.answer_options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className={`py-3 px-4 rounded-md border ${
                                    option === question.correct_answer
                                      ? "border-primary bg-primary/5"
                                      : practiceState.answers[question.id] === option
                                      ? "border-destructive bg-destructive/5"
                                      : "border-muted"
                                  }`}
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Explanation */}
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Explanation:</div>
                          <div className="px-4 py-3 rounded-md border bg-muted/30">{question.explanation}</div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
