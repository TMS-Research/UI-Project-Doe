"use client";

import { CourseCard } from "@/app/(pages)/(main)/components/course-card";
import { CourseSearch } from "@/app/(pages)/(main)/(pages)/dashboard/components/course-search";
import axiosInstance from "@/app/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Course } from "@/types/api/course.dto";

export default function CoursesPage() {
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await axiosInstance.get("/courses");
      return response.data;
    },
  });

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Courses</h1>
        <p className="text-gray-600">Browse and discover new courses</p>
      </div>

      <CourseSearch />

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            code={course.code}
            description={course.description}
            category={course.category}
            difficulty_level={course.difficulty_level}
            instructor_info={course.instructor_info}
            progress={course.progress || 0}
            lastAccessed={course.lastAccessed || "Never"}
            imageUrl={course.imageUrl}
            isMyCourse={false}
          />
        ))}
      </div>
    </div>
  );
}
