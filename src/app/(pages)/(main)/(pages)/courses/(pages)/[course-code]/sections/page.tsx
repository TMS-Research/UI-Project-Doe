"use client";

import { useParams } from "next/navigation";
import { SectionSearch } from "../components/section-search";
import { SectionsList } from "../components/sections-list";
import { useCoursesStore } from "@/stores/courses-store";
import { useEffect } from "react";

export default function CourseSectionsPage() {
  const params = useParams();
  const courseId = params["course-code"] as string;
  const { setActiveCourse } = useCoursesStore();

  useEffect(() => {
    setActiveCourse(courseId);
  }, [courseId, setActiveCourse]);

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Course Sections</h1>
        <p className="text-gray-600">Browse and search through course sections</p>
      </div>

      <SectionSearch courseId={courseId} />

      <SectionsList courseId={courseId} />
    </div>
  );
}
