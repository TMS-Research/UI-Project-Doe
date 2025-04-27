"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSectionsStore } from "@/stores/sections-store";
import useTopicsStore from "@/stores/topics-store";
import { CheckCircle2, Circle, CircleDot } from "lucide-react";

export default function SyllabusStepper() {
  const { activeSection, setActiveSection } = useSectionsStore();
  const { topics } = useTopicsStore();

  // Find the current topic and section based on the active section
  const getCurrentProgress = () => {
    let currentTopicIndex = -1;

    // If no active section, try to find the first incomplete section
    if (!activeSection) {
      for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
        const topic = topics[topicIndex];
        for (let sectionIndex = 0; sectionIndex < topic.sections.length; sectionIndex++) {
          const section = topic.sections[sectionIndex];
          // Set as current if this is the first section or if previous section is completed
          if (topicIndex === 0 && sectionIndex === 0) {
            currentTopicIndex = topicIndex;
            setActiveSection(section);
            return { currentTopicIndex };
          }
        }
      }
      return { currentTopicIndex };
    }

    topics.forEach((topic, topicIndex) => {
      topic.sections.forEach((section) => {
        if (section.id === activeSection.id) {
          currentTopicIndex = topicIndex;
        }
      });
    });

    return { currentTopicIndex };
  };

  const { currentTopicIndex } = getCurrentProgress();

  return (
    <ScrollArea className="flex flex-col h-full w-[20rem] mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Course Progress</h2>
        <p className="text-sm text-muted-foreground">Track your learning journey</p>
      </div>

      <Accordion type="multiple">
        {topics.map((topic, topicIndex) => {
          const isCurrentTopic = topicIndex === currentTopicIndex;

          return (
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
                      isCurrentTopic ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <span>{topicIndex + 1}</span>
                  </div>
                  <h3
                    className={cn(
                      "font-medium text-left",
                      isCurrentTopic ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {topic.title}
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {topic.sections.map((section) => {
                    const isCompleted = section.isCompleted;
                    const isCurrent = section.id === activeSection?.id;

                    return (
                      <div
                        key={section.id}
                        className="flex items-center p-2"
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
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </ScrollArea>
  );
}
