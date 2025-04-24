"use client";

import axiosInstance from "@/app/api/axios";
import { LearningContentPanel } from "@/components/LearningContentPanel";
import { Progress } from "@/components/ui/progress";
import { sampleLearningContent } from "@/data/sample-learning-content";
import { useCoursesStore } from "@/stores/courses-store";
import { useSectionsStore } from "@/stores/sections-store";
import { SyllabusContent } from "@/types/api/syllabus.dto";
import { useQuery } from "@tanstack/react-query";
import { Book, CheckCircle, Clock } from "lucide-react";

export default function LearnPage() {
  const { activeCourse } = useCoursesStore();
  const { activeSection } = useSectionsStore();

  const { data: content } = useQuery<SyllabusContent>({
    queryKey: ["content", activeCourse?.id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/courses/${activeCourse?.id}/sections/${activeSection?.id}`);
      return response.data;
    },
    enabled: !!activeCourse?.id && !!activeSection?.id,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="bg-background rounded-xl p-6 shadow">
        <div className="flex flex-col gap-4">
          <div>
            <div className="inline-flex px-2 py-1 rounded-full text-sm bg-primary/10 text-primary mb-2">
              {activeSection?.slug}
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
