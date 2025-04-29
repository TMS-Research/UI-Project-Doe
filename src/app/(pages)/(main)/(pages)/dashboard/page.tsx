"use client";

import axiosInstance from "@/app/api/axios";
import { Input } from "@/components/ui/input";
import { useCoursesStore } from "@/stores/courses-store";
import useLayoutStore from "@/stores/layout-store";
import { Course } from "@/types/api/course.dto";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { CourseCard } from "../courses/components/course-card";

export default function DashboardPage() {
  const { setActiveCourse } = useCoursesStore();
  const { setSidebarContent } = useLayoutStore();

  useEffect(() => {
    setSidebarContent("default");
  }, []);

  // Using mock data with useQuery for easy switching to real API later
  const { data: myCourses } = useQuery<Course[]>({
    queryKey: ["myCourses"],
    queryFn: async () => {
      const response = await axiosInstance.get("/courses/my");
      return response.data;
    },
  });

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await axiosInstance.get("/courses");
      return response.data;
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-8 mt-12">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="relative w-64 flex items-center rounded-full">
          <Input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 rounded-full"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* My Courses Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Courses</h2>
          <a
            href="/courses"
            className="text-primary hover:underline"
          >
            View All
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCourses?.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onCourseSelect={setActiveCourse}
              showProgress={true}
              buttonText="Continue"
            />
          ))}
        </div>
      </div>

      {/* Recommended Courses Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Recommended Courses</h2>
          <a
            href="/courses"
            className="text-primary hover:underline"
          >
            Browse More
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onCourseSelect={setActiveCourse}
              showProgress={false}
              buttonText="View Course"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
