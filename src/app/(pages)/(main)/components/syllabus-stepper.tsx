"use client";

import axiosInstance from "@/app/api/axios";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useCoursesStore } from "@/stores/courses-store";
import { Course } from "@/types/api/course.dto";
import { useQuery } from "@tanstack/react-query";
import { Check, CheckCircle2, Circle, CircleDot } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function SyllabusStepper() {
  const { "course-code": courseCode } = useParams();
  const pathname = usePathname();
  const { activeCourse } = useCoursesStore();

  // Fetch course data including topics and sections
  const { data: course } = useQuery<Course>({
    queryKey: ["course", courseCode],
    queryFn: async () => {
      const response = await axiosInstance.get(`/courses/${activeCourse?.id}`);
      return response.data;
    },
    enabled: !!activeCourse,
  });

  // Find the current topic and section based on the pathname
  const getCurrentProgress = () => {
    let currentTopicIndex = -1;
    let currentSectionIndex = -1;

    if (!course?.topics) return { currentTopicIndex, currentSectionIndex };

    course.topics.forEach((topic, topicIndex) => {
      topic.sections.forEach((section, sectionIndex) => {
        if (section.id === pathname.split("/").pop()) {
          currentTopicIndex = topicIndex;
          currentSectionIndex = sectionIndex;
        }
      });
    });

    return { currentTopicIndex, currentSectionIndex };
  };

  const { currentTopicIndex, currentSectionIndex } = getCurrentProgress();

  if (!course?.topics) {
    return (
      <ScrollArea className="flex flex-col h-full w-[20rem] max-w-3xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Course Progress</h2>
          <p className="text-sm text-muted-foreground">Loading course content...</p>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex flex-col h-full w-[20rem] max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Course Progress</h2>
        <p className="text-sm text-muted-foreground">Track your learning journey</p>
      </div>

      <Accordion type="multiple">
        {course.topics.map((topic, topicIndex) => (
          <AccordionItem
            key={topic.id}
            value={topic.id}
            className="relative border-none"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center size-6 rounded-full mr-3",
                    topicIndex < currentTopicIndex
                      ? "bg-primary text-primary-foreground"
                      : topicIndex === currentTopicIndex
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {topicIndex < currentTopicIndex ? <Check className="size-4" /> : <span>{topicIndex + 1}</span>}
                </div>
                <h3
                  className={cn(
                    "font-medium text-left",
                    topicIndex <= currentTopicIndex ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {topic.title}
                </h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {topic.sections.map((section, sectionIndex) => {
                  const isCompleted =
                    topicIndex < currentTopicIndex ||
                    (topicIndex === currentTopicIndex && sectionIndex < currentSectionIndex);
                  const isCurrent = topicIndex === currentTopicIndex && sectionIndex === currentSectionIndex;

                  return (
                    <Link
                      key={section.id}
                      href={`/courses/${activeCourse}/learn/${section.id}`}
                      className={cn(
                        "flex items-center py-2 px-3 rounded-md transition-colors",
                        isCurrent
                          ? "bg-primary/10 text-primary"
                          : isCompleted
                          ? "text-foreground hover:bg-muted"
                          : "text-muted-foreground hover:bg-muted/50",
                      )}
                    >
                      <div className="mr-3">
                        {isCompleted ? (
                          <CheckCircle2 className="size-5 text-primary" />
                        ) : isCurrent ? (
                          <CircleDot className="size-5 text-primary" />
                        ) : (
                          <Circle className="size-5 text-muted-foreground" />
                        )}
                      </div>
                      <span className={cn("text-sm", isCurrent ? "font-medium" : "")}>{section.title}</span>
                    </Link>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
}
