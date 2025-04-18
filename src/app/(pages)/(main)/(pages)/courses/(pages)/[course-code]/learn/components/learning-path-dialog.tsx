"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";

interface LearningPathDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseCode: string;
  syllabusCode: string;
}

export default function LearningPathDialog({ isOpen, onClose, courseCode, syllabusCode }: LearningPathDialogProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>("new");
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);

  // Dummy data for available chapters
  const availableChapters = [
    { id: "4.4", title: "Advanced Concepts" },
    { id: "4.5", title: "Practical Applications" },
    { id: "5.7", title: "Case Studies" },
    { id: "6.1", title: "Final Project" },
  ];

  // Dummy data for previous plan
  const previousPlan = [
    { id: "3.2", title: "Data Structures", completed: false },
    { id: "3.3", title: "Algorithms", completed: true },
    { id: "3.4", title: "Problem Solving", completed: false },
  ];

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleChapterToggle = (chapterId: string) => {
    setSelectedChapters((prev) =>
      prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId],
    );
  };

  const handleContinue = () => {
    if (selectedOption === "new" && selectedChapters.length > 0) {
      // Navigate to the first selected chapter
      router.push(`/courses/${courseCode}/learn/${selectedChapters[0]}`);
    } else if (selectedOption === "continue") {
      // Find the first uncompleted chapter from the previous plan
      const nextChapter = previousPlan.find((chapter) => !chapter.completed);
      if (nextChapter) {
        router.push(`/courses/${courseCode}/learn/${nextChapter.id}`);
      } else {
        // If all chapters are completed, go to the first available chapter
        router.push(`/courses/${courseCode}/learn/${availableChapters[0].id}`);
      }
    } else if (selectedOption === "unplanned") {
      // Start with the current syllabus code
      router.push(`/courses/${courseCode}/learn/${syllabusCode}`);
    }
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Your Learning Path</DialogTitle>
          <DialogDescription>Select how you want to proceed with your learning journey.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
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
                <p className="text-sm text-muted-foreground">Pick specific chapters you want to learn</p>
                {selectedOption === "new" && (
                  <div className="mt-2 space-y-2">
                    {availableChapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={chapter.id}
                          checked={selectedChapters.includes(chapter.id)}
                          onCheckedChange={() => handleChapterToggle(chapter.id)}
                        />
                        <Label
                          htmlFor={chapter.id}
                          className="text-sm"
                        >
                          {chapter.title} ({chapter.id})
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem
                value="continue"
                id="continue"
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="continue"
                  className="font-medium"
                >
                  Continue where you left off
                </Label>
                <p className="text-sm text-muted-foreground">Resume your previous learning plan</p>
                {selectedOption === "continue" && (
                  <div className="mt-2 space-y-2">
                    {previousPlan.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`prev-${chapter.id}`}
                          checked={chapter.completed}
                          disabled
                        />
                        <Label
                          htmlFor={`prev-${chapter.id}`}
                          className={`text-sm ${chapter.completed ? "line-through text-muted-foreground" : ""}`}
                        >
                          {chapter.title} ({chapter.id})
                        </Label>
                      </div>
                    ))}
                  </div>
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
                <p className="text-sm text-muted-foreground">Start with the current chapter without a specific plan</p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button onClick={handleContinue}>{selectedOption === "new" ? "Start New Plan" : "Continue"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
