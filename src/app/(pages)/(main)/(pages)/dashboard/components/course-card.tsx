import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";
interface CourseCardProps {
  title: string;
  code: string;
  instructor: string;
  progress: number;
  lastAccessed: string;
  subject: string;
  imageUrl: string;
  className?: string;
}

export function CourseCard({ title, code, instructor, progress, lastAccessed, subject, className }: CourseCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex gap-4 p-4">
        <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-md">
          <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-md bg-primary/20"></div>
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div>
            <div className="inline-flex px-2 py-1 rounded-full text-sm bg-primary/10 text-primary mb-2">{subject}</div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {code} • {instructor}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">Progress</div>
              <div className="flex-1">
                <Progress value={progress} />
              </div>
              <div className="text-sm font-medium">{progress}%</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last accessed: {lastAccessed}</span>
              <Button
                variant="default"
                size="sm"
                asChild
              >
                <Link href={`/courses/${code}/corridor`}>Continue</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
