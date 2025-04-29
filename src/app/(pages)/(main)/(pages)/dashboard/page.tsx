"use client";

import axiosInstance from "@/app/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCoursesStore } from "@/stores/courses-store";
import useLayoutStore from "@/stores/layout-store";
import { Course } from "@/types/api/course.dto";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Rating } from "@/components/ui/rating";

export default function DashboardPage() {
  const { courses, setActiveCourse } = useCoursesStore();
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
            <Card
              key={course.id}
              className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
            >
              <div className="relative h-40">
                <Image
                  src={course.image || "/placeholder-course.jpg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  {course.level}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{course.instructor}</p>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-sm">{course.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{course.duration}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${course.completion_percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span>Progress</span>
                  <span>{course.completion_percentage}%</span>
                </div>
                <Button
                  className="w-full"
                  asChild
                  onClick={() => setActiveCourse(course.id)}
                >
                  <Link href={`/courses/${course.code}/corridor`}>Continue</Link>
                </Button>
              </CardContent>
            </Card>
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
            <Card
              key={course.id}
              className="overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
            >
              <div className="relative h-60">
                <Image
                  src={course.image || "/example-course.jpeg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Beginer
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Rating value={4} />
                    <span className="text-sm text-muted-foreground">(123 Reviews)</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{course.duration}</span>
                </div>
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                <p className="text-sm bg-primary/10 rounded-full px-2 py-1 mb-2 w-fit">{course.instructor_info.name}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
              </CardContent>
              <CardFooter className="flex flex-col self-end mt-auto w-full">
                <Button
                  className="w-full"
                  onClick={() => setActiveCourse(course.id)}
                  asChild
                >
                  <Link href={`/courses/${course.code}/corridor`}>View Course</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
