"use client";

import { useCoursesStore } from "@/stores/courses-store";
import { SectionSearch } from "../components/section-search";
import { SectionsList } from "../components/sections-list";

export default function CourseSectionsPage() {
  const { activeCourse } = useCoursesStore();

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Course Sections</h1>
        <p className="text-gray-600">Browse and search through course sections</p>
      </div>

      <SectionSearch courseId={activeCourse?.id ?? ""} />

      <SectionsList courseId={activeCourse?.id ?? ""} />
    </div>
  );
}
