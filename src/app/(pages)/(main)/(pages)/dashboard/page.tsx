"use client";

import { CourseCard } from "@/app/(pages)/(main)/(pages)/dashboard/components/course-card";
import { CourseSearch } from "@/app/(pages)/(main)/(pages)/dashboard/components/course-search";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

const continueLearningCourses = [
  {
    title: "Introduction to Computer Science",
    code: "CS101",
    instructor: "Dr. Alan Turing",
    progress: 65,
    lastAccessed: "2 days ago",
    subject: "Computer Science",
    imageUrl: "https://placehold.co/600x400/png",
  },
  {
    title: "Calculus I",
    code: "MATH201",
    instructor: "Dr. Katherine Johnson",
    progress: 42,
    lastAccessed: "5 days ago",
    subject: "Mathematics",
    imageUrl: "https://placehold.co/600x400/png",
  },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all subjects");

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your learning journey!</p>
      </div>

      <CourseSearch
        onSearch={setSearchQuery}
        onFilterChange={setSelectedSubject}
      />

      <div>
        <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
        <div className="grid gap-6">
          {continueLearningCourses.map((course) => (
            <CourseCard
              key={course.code}
              {...course}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">My Courses</h2>
          <Button
            variant="link"
            asChild
          >
            <Link href="/courses">View all</Link>
          </Button>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {continueLearningCourses.map((course) => (
            <CourseCard
              key={course.code}
              {...course}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
