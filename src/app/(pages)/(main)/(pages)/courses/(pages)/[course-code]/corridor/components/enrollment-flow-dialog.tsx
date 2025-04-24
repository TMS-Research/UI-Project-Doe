import axiosInstance from "@/app/api/axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCoursesStore } from "@/stores/courses-store";
import { Course, CourseSection, CourseTopic } from "@/types/api/course.dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Upload, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface EnrollmentFlowDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseCode: string;
  syllabusCode: string;
}

type Step = "plan" | "content" | "loading";
type LoadingState = "uploading" | "analyzing" | "creating-quiz" | null;

interface CreateLearningPlanPayload {
  course_id: string;
  sections: {
    section_id: string;
    topic_id: string;
    topic_order: number;
    section_order: number;
    notes: string;
  }[];
}

export default function EnrollmentFlowDialog({ isOpen, onClose, courseCode }: EnrollmentFlowDialogProps) {
  const [currentStep, setCurrentStep] = useState<Step>("plan");
  const [loadingState, setLoadingState] = useState<LoadingState>(null);
  const [selectedOption, setSelectedOption] = useState<string>("new");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { activeCourse } = useCoursesStore();

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Fetch course data including topics and sections
  const { data: course, isLoading } = useQuery<Course>({
    queryKey: ["course", courseCode],
    queryFn: async () => {
      const response = await axiosInstance.get(`/courses/${activeCourse?.id}`);
      return response.data;
    },
    enabled: !!courseCode,
  });

  // Create learning plan mutation
  const { mutate: createLearningPlan, isPending: isCreatingPlan } = useMutation({
    mutationFn: async (payload: CreateLearningPlanPayload) => {
      const response = await axiosInstance.post("/learning-plans", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Learning plan created successfully");
      setCurrentStep("content");
    },
    onError: (error) => {
      toast.error("Failed to create learning plan");
      console.error("Error creating learning plan:", error);
    },
  });

  // Upload content mutation
  const { mutate: uploadContent } = useMutation({
    mutationFn: async () => {
      if (!file) {
        throw new Error("No file selected");
      }

      // Start the mock progress
      setUploadProgress(0);
      progressIntervalRef.current = setInterval(() => {
        setUploadProgress((prev) => {
          const increment = Math.max(1, Math.floor((100 - prev) / 10));
          return Math.min(prev + increment, 95);
        });
      }, 2000);

      const formData = new FormData();
      formData.append("file", file);

      if (activeCourse?.id) {
        formData.append("course_id", activeCourse.id);
      }

      const response = await axiosInstance.post("/student-resources/document", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onMutate: () => {
      setIsUploading(true);
      setLoadingState("uploading");
    },
    onSuccess: () => {
      // Clear the interval and set progress to 100%
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setUploadProgress(100);

      // Wait a moment to show 100% before closing
      setTimeout(() => {
        toast.success("Resource uploaded successfully");
        onClose();
      }, 500);
    },
    onError: (error) => {
      // Clear the interval on error
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setUploadProgress(0);
      setLoadingState(null);
      toast.error("Failed to upload resource");
      console.error("Error uploading resource:", error);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleTopicToggle = (topicId: string, topic: CourseTopic) => {
    const isSelected = selectedTopics.includes(topicId);

    if (isSelected) {
      // Remove topic and all its sections
      setSelectedTopics((prev) => prev.filter((id) => id !== topicId));
      setSelectedSections((prev) =>
        prev.filter((sectionId) => !topic.sections.some((section) => section.id === sectionId)),
      );
    } else {
      // Add topic and all its sections
      setSelectedTopics((prev) => [...prev, topicId]);
      setSelectedSections((prev) => [...prev, ...topic.sections.map((section) => section.id)]);
    }
  };

  const handleSectionToggle = (sectionId: string, topicId: string) => {
    const topic = course?.topics?.find((t) => t.id === topicId);
    if (!topic) return;

    const isSelected = selectedSections.includes(sectionId);

    // Update selected sections
    const newSelectedSections = isSelected
      ? selectedSections.filter((id) => id !== sectionId)
      : [...selectedSections, sectionId];
    setSelectedSections(newSelectedSections);

    // Check if all sections of this topic are selected
    const topicSections = topic.sections.map((section) => section.id);
    const allSectionsSelected = topicSections.every((id) => newSelectedSections.includes(id));

    // Update topic selection based on whether all sections are selected
    if (allSectionsSelected) {
      setSelectedTopics((prev) => [...prev, topicId]);
    } else {
      setSelectedTopics((prev) => prev.filter((id) => id !== topicId));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (newFile) {
      setFile(newFile);
      uploadContent();
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleNextStep = async () => {
    if (currentStep === "plan") {
      if (selectedOption === "new" && selectedSections.length > 0) {
        const sectionsData =
          course?.topics
            ?.filter((topic) => topic.sections.some((section) => selectedSections.includes(section.id)))
            .flatMap((topic) =>
              topic.sections
                .filter((section) => selectedSections.includes(section.id))
                .map((section) => ({
                  section_id: section.id,
                  topic_id: topic.id,
                  topic_order: topic.topic_order,
                  section_order: section.order || 0,
                  notes: "",
                })),
            ) || [];

        createLearningPlan({
          course_id: activeCourse?.id || "",
          sections: sectionsData,
        });
      } else {
        setCurrentStep("content");
      }
    } else if (currentStep === "content") {
      onClose();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const newFile = e.dataTransfer.files?.[0];
    if (newFile) {
      setFile(newFile);
      uploadContent();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "plan":
        return (
          <div className="space-y-4">
            <RadioGroup
              value={selectedOption}
              onValueChange={handleOptionChange}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem
                  value="new"
                  id="new"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="new"
                    className="font-medium"
                  >
                    Start a new plan
                  </Label>
                  <p className="text-sm text-muted-foreground">Pick specific sections you want to learn</p>
                  {selectedOption === "new" && (
                    <ScrollArea className="max-h-[300px] mt-2">
                      <div className="space-y-4 pr-4">
                        {isLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin" />
                          </div>
                        ) : (
                          course?.topics?.map((topic: CourseTopic) => (
                            <div
                              key={topic.id}
                              className="space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`topic-${topic.id}`}
                                  checked={selectedTopics.includes(topic.id)}
                                  onCheckedChange={() => handleTopicToggle(topic.id, topic)}
                                />
                                <Label
                                  htmlFor={`topic-${topic.id}`}
                                  className="font-medium text-sm"
                                >
                                  {topic.title}
                                </Label>
                              </div>
                              <div className="ml-6 space-y-2">
                                {topic.sections.map((section: CourseSection) => (
                                  <div
                                    key={section.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={section.id}
                                      checked={selectedSections.includes(section.id)}
                                      onCheckedChange={() => handleSectionToggle(section.id, topic.id)}
                                    />
                                    <Label
                                      htmlFor={section.id}
                                      className="text-sm"
                                    >
                                      {section.title}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem
                  value="unplanned"
                  id="unplanned"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="unplanned"
                    className="font-medium"
                  >
                    Unplanned learning
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Start with the current section without a specific plan
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        );

      case "content":
        return (
          <div className="space-y-4">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                file ? "border-primary bg-primary/5" : "",
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-8 w-8 text-primary" />
                    <p className="font-medium">{file.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Document file</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-center font-medium">Drag and drop your file here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-2">Supported files: documents, audio, and images</p>
                </>
              )}
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.xls,.xlsx,.ppt,.pptx,.mp3,.wav,.ogg,.m4a,.aac,.flac,.jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
                onChange={handleFileChange}
              />
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress
                  value={uploadProgress}
                  className="h-2"
                />
              </div>
            )}

            {/* {renderLoadingState()} */}
          </div>
        );

      case "loading":
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Preparing your learning environment</p>
            <p className="text-sm text-muted-foreground text-center">
              We&apos;re analyzing your content and customizing the course materials for you. This will only take a
              moment...
            </p>
          </div>
        );
    }
  };

  const renderLoadingState = () => {
    switch (loadingState) {
      case "uploading":
        return (
          <div className="flex flex-col items-center justify-center py-4 space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-center">Uploading and scanning your lecture notes... ⏳</p>
          </div>
        );
      case "analyzing":
        return (
          <div className="flex flex-col items-center justify-center py-4 space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-center">Almost done analyzing the document!</p>
          </div>
        );
      case "creating-quiz":
        return (
          <div className="flex flex-col items-center justify-center py-4 space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-center">We&apos;ve created a practice quiz 📊 from your lecture!</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {currentStep === "plan" && "Choose Your Learning Path"}
            {currentStep === "content" && "Upload Your Content (Optional)"}
            {currentStep === "loading" && "Setting Up Your Course"}
          </DialogTitle>
          <DialogDescription>
            {currentStep === "plan" && "Select how you want to proceed with your learning journey."}
            {currentStep === "content" && "Help us personalize your learning experience."}
            {currentStep === "loading" && "Please wait while we prepare your course materials."}
          </DialogDescription>
        </DialogHeader>

        {renderStepContent()}

        {currentStep !== "loading" && (
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              {currentStep === "plan" ? "Cancel" : "Upload Later"}
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={isCreatingPlan || isUploading}
            >
              {isCreatingPlan || isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isCreatingPlan ? "Creating Plan..." : "Uploading..."}
                </>
              ) : currentStep === "plan" ? (
                "Next"
              ) : (
                "Continue to Course"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
