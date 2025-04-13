"use client";

import axiosInstance from "@/app/api/axios";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { queryClient } from "@/lib/react-query";
import { useCoursesStore } from "@/stores/courses-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Clock, Facebook, Linkedin, MessageCircle, Share2, Twitter, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function CorridorPage() {
  const { "course-code": courseCode } = useParams();

  const { data: course } = useQuery({
    queryKey: ["course", courseCode],
    queryFn: async () => {
      const response = await axiosInstance.get(`/courses/${courseCode}`);
      return response.data;
    },
    enabled: !!courseCode,
  });

  const { setActiveCourse } = useCoursesStore();

  useEffect(() => {
    setActiveCourse(courseCode as string);
  }, [courseCode, setActiveCourse]);

  const corridorSections = [
    {
      title: "Discussion Forum",
      description: "Engage with your peers and instructors",
      icon: <MessageCircle className="w-6 h-6" />,
      href: `/courses/${courseCode}/forum`,
      stats: "156 discussions",
    },
    {
      title: "Study Groups",
      description: "Join or create study groups",
      icon: <Users className="w-6 h-6" />,
      href: `/courses/${courseCode}/groups`,
      stats: "8 active groups",
    },
  ];

  const { mutate: enrollCourse } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(`/courses/${courseCode}/enroll`);
      return response.data;
    },
    mutationKey: ["enrollCourse", courseCode],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseCode] });
      toast.success("Course enrolled successfully");
    },
    onError: () => {
      toast.error("Failed to enroll in course");
    },
  });

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex flex-col gap-4">
          <div>
            <div className="inline-flex px-2 py-1 rounded-full text-sm bg-primary/10 text-primary mb-2">
              {course?.code}
            </div>
            <h1 className="text-2xl font-bold">{course?.title}</h1>
            <p className="text-muted-foreground">Instructor: {course?.instructor_info?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Course Progress</div>
            <div className="flex-1">
              <Progress value={course?.progress} />
            </div>
            <div className="text-sm font-medium">{course?.progress}%</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Left Column - Course Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{course?.description}</p>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {course?.learning_objectives?.map((objective: any, index: number) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prerequisites</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-600">
                {course?.prerequisites?.map((prerequisite: any, index: number) => (
                  <li key={index}>{prerequisite}</li>
                ))}
              </ul>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>Course Syllabus</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion
                type="single"
                collapsible
                className="w-full"
              >
                {course?.sections?.map((section: any, index: number) => (
                  <AccordionItem
                    key={index}
                    value={`section-${index}`}
                  >
                    <AccordionTrigger>{section.title}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {section.content?.topics?.map((topic: any, topicIndex: number) => (
                          <div
                            key={topicIndex}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                              <span>{topic}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{1}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {corridorSections.map((section) => (
              <Card
                key={section.title}
                className="hover:shadow-lg transition-shadow"
              >
                <Link href={section.href}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">{section.icon}</div>
                      <div>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{section.stats}</p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column - Course Details & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ready to start learning?</CardTitle>
              <CardDescription>Enroll now to access all course materials</CardDescription>
            </CardHeader>
            <CardContent>
              {course?.is_enrolled ? (
                <Button
                  asChild
                  className="w-full"
                >
                  <Link href={`/courses/${courseCode}/learn/${course?.sections[0].id}`}>Continue to Course</Link>
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => enrollCourse()}
                >
                  Enroll Now
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{course?.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Course Code:</span>
                <span className="font-medium">{course?.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Credits:</span>
                <span className="font-medium">{course?.sections?.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Level:</span>
                <span className="font-medium">{course?.difficulty_level}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share This Course</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
