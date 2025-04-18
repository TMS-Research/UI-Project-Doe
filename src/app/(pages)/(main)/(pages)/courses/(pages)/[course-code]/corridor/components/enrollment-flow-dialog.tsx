import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/api/axios";
import { Course, CourseSection, CourseTopic } from "@/types/api/course.dto";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useCoursesStore } from "@/stores/courses-store";
import { Textarea } from "@/components/ui/textarea";

interface EnrollmentFlowDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseCode: string;
  syllabusCode: string;
}

type Step = "plan" | "content" | "loading";

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
  const [currentStep, setCurrentStep] = useState<Step>("content");
  const [selectedOption, setSelectedOption] = useState<string>("new");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { activeCourse } = useCoursesStore();

  // Fetch course data including topics and sections
  const { data: course, isLoading } = useQuery<Course>({
    queryKey: ["course", courseCode],
    queryFn: async () => {
      const response = await axiosInstance.get(`/courses/${courseCode}`);
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
  const { mutate: uploadContent, isPending: isUploading } = useMutation({
    mutationFn: async () => {
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);

      if (description) {
        formData.append("description", description);
      }

      if (activeCourse?.id) {
        formData.append("course_id", activeCourse.id);
      }

      const response = await axiosInstance.postForm("/content/upload", formData);

      return response.data;
    },
    onSuccess: () => {
      toast.success("Content uploaded successfully");
      setCurrentStep("loading");
    },
    onError: (error) => {
      toast.error("Failed to upload content");
      console.error("Error uploading content:", error);
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
      const defaultTitle = newFile.name.split(".")[0];
      setTitle(defaultTitle);
      setFile(newFile);

      // Trigger upload immediately with the file and default title
      const formData = new FormData();
      formData.append("file", newFile);
      formData.append("title", defaultTitle);

      if (activeCourse?.id) {
        formData.append("course_id", activeCourse.id);
      }

      uploadContent();
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setTitle("");
    setDescription("");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
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
      setCurrentStep("loading");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      onClose();
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
                    <ScrollArea className="h-[400px] mt-2">
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
            <div className="border-2 border-dashed rounded-lg p-6">
              <div className="flex flex-col items-center gap-4">
                <Input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">Click to upload file</span>
                  <span className="text-xs text-muted-foreground">or drag and drop</span>
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  className="mt-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              </div>
              {file && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Selected file:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      <span className="max-w-[150px] truncate">{file.name}</span>
                      <button
                        onClick={handleRemoveFile}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {file && (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Enter title for your content"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter description for your content"
                    rows={3}
                  />
                </div>

                {isUploading && (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Uploading document...</span>
                  </div>
                )}
              </div>
            )}
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

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-md">
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
