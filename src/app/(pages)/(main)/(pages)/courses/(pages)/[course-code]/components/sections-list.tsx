import { useSectionsStore } from "@/stores/sections-store";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, Book } from "lucide-react";

type SectionsListProps = {
  courseId: string;
};

export function SectionsList({ courseId }: SectionsListProps) {
  const { filteredSections, isLoading } = useSectionsStore();

  return (
    <div className="space-y-4">
      {isLoading ? (
        <p>Loading sections...</p>
      ) : filteredSections.length > 0 ? (
        filteredSections.map((section) => (
          <Card
            key={section.id}
            className="p-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Book className="h-4 w-4" />
                    <span>Section {section.order}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>30 min</span>
                  </div>
                </div>
              </div>

              <Button asChild>
                <Link href={`/courses/${courseId}/learn/${section.id}`}>Start Learning</Link>
              </Button>
            </div>
          </Card>
        ))
      ) : (
        <p>No sections found</p>
      )}
    </div>
  );
}
