"use client";

import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";

type SyllabusLinkProps = {
  courseId: string;
};

export function SyllabusLink({ courseId }: SyllabusLinkProps) {
  return (
    <Button
      asChild
      variant="outline"
      className="w-full"
    >
      <Link
        href={`/courses/${courseId}/learn/syllabus`}
        className="flex items-center gap-2"
      >
        <BookOpen className="h-4 w-4" />
        <span>View Course Syllabus</span>
      </Link>
    </Button>
  );
}
