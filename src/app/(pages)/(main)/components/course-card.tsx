"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useCoursesStore } from "@/stores/courses-store";
import { Course } from "@/types/api/course.dto";
import Link from "next/link";

type CourseCardProps = Pick<
  Course,
  | "id"
  | "title"
  | "code"
  | "description"
  | "category"
  | "difficulty_level"
  | "instructor_info"
  | "completion_percentage"
> & {
  className?: string;
  isMyCourse?: boolean;
  lastAccessed?: string;
  imageUrl?: string;
};

export function CourseCard({
  id,
  title,
  code,
  category,
  instructor_info,
  completion_percentage = "0",
  className,
  isMyCourse,
}: CourseCardProps) {
  const { setActiveCourse } = useCoursesStore();

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex gap-4 p-4">
        <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-md">
          {/* {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
              width={192}
              height={128}
            />
          ) : (
          )} */}
          <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-md bg-primary/20"></div>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="inline-flex px-2 py-1 rounded-full text-sm bg-primary/10 text-primary mb-2">{category}</div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {code} • {instructor_info?.name || "Unknown Instructor"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">Progress</div>
              <div className="flex-1">
                <Progress value={Number(completion_percentage)} />
              </div>
              <div className="text-sm font-medium">{completion_percentage}%</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last accessed: Mon, 12 Apr 2025</span>
              <Button
                variant="default"
                size="sm"
                asChild
                onClick={() => setActiveCourse(id)}
              >
                <Link href={`/courses/${code}/corridor`}>{isMyCourse ? "Continue" : "View Course"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
