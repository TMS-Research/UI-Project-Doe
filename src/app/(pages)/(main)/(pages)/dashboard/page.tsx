"use client";

import { CourseCard } from "@/app/(pages)/(main)/components/course-card";
import axiosInstance from "@/app/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useCoursesStore } from "@/stores/courses-store";
import { useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { Course } from "@/types/api/course.dto";

export default function DashboardPage() {
  const { courses, fetchCourses } = useCoursesStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const { data: myCourses } = useQuery<Course[]>({
    queryKey: ["myCourses"],
    queryFn: async () => {
      const response = await axiosInstance.get("/courses/my");
      return response.data;
    },
  });

  // Sample data for the chart - replace with real data later
  const chartData = [
    { name: "Mon", progress: 30 },
    { name: "Tue", progress: 45 },
    { name: "Wed", progress: 60 },
    { name: "Thu", progress: 75 },
    { name: "Fri", progress: 85 },
    { name: "Sat", progress: 90 },
    { name: "Sun", progress: 95 },
  ];

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your learning journey!</p>
      </div>

      {/* Learning Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Bar
                  dataKey="progress"
                  fill="hsl(var(--primary))"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* My Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">My Courses</h2>
          <Button
            variant="link"
            asChild
          >
            <Link href="/courses">View all courses</Link>
          </Button>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {myCourses?.map((course) => (
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
              isMyCourse={true}
            />
          ))}
        </div>
      </div>

      {/* Recommended Courses Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((course) => (
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
    </div>
  );
}
