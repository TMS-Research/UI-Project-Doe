import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import { Course } from "@/types/api/course.dto";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
  onCourseSelect?: (courseId: string) => void;
  showProgress?: boolean;
  buttonText?: string;
}

export function CourseCard({
  course,
  onCourseSelect,
  showProgress = false,
  buttonText = "View Course",
}: CourseCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
      <div className="relative h-60">
        <Image
          src={course.image || "/example-course.jpeg"}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
          {course.level || "Beginner"}
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Rating value={course.rating || 4} />
            <span className="text-sm text-muted-foreground">(123 Reviews)</span>
          </div>
          <span className="text-sm text-muted-foreground">{course.duration}</span>
        </div>
        <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <p className="text-sm bg-primary/10 rounded-full px-2 py-1 mb-2 w-fit">
          {course.instructor_info?.name || course.instructor}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
        {showProgress && (
          <>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${course.completion_percentage || 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span>Progress</span>
              <span>{course.completion_percentage || 0}%</span>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col self-end mt-auto w-full">
        <Button
          className="w-full"
          onClick={() => onCourseSelect?.(course.id)}
          asChild
        >
          <Link href={`/courses/${course.code}/corridor`}>{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
