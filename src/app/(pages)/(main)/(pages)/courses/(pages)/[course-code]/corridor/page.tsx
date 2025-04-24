"use client";

import axiosInstance from "@/app/api/axios";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { queryClient } from "@/lib/react-query";
import { useCoursesStore } from "@/stores/courses-store";
import useTopicsStore from "@/stores/topics-store";
import { useSectionsStore } from "@/stores/sections-store";
import { Course, CourseSection, CourseTopic } from "@/types/api/course.dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BookOpen, Clock, Facebook, Linkedin, MessageCircle, Share2, Twitter, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import EnrollmentFlowDialog from "./components/enrollment-flow-dialog";
import useLayoutStore from "@/stores/layout-store";

export default function CorridorPage() {
  const { activeCourse } = useCoursesStore();
  const { setTopics } = useTopicsStore();
  const { setActiveSection } = useSectionsStore();
  const { setIsSidebarCollapsed } = useLayoutStore();

  const router = useRouter();

  const [showEnrollmentFlow, setShowEnrollmentFlow] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: course } = useQuery<Course>({
    queryKey: ["course", activeCourse?.id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/courses/${activeCourse?.id}`);
      return response.data;
    },
    enabled: !!activeCourse,
  });

  useEffect(() => {
    if (course?.topics) {
      setTopics(course.topics);
    }
  }, [course, setTopics]);

  const corridorSections = [
    {
      title: "Course Syllabus",
      description: "View the complete course structure and learning path",
      icon: <BookOpen className="w-6 h-6" />,
      href: `/courses/${activeCourse?.code}/learn/syllabus`,
    },
    {
      title: "Discussion Forum",
      description: "Engage with your peers and instructors",
      icon: <MessageCircle className="w-6 h-6" />,
      href: `/courses/${activeCourse?.code}/discussion`,
    },
    {
      title: "Study Groups",
      description: "Join or create study groups",
      icon: <Users className="w-6 h-6" />,
      href: `/courses/${activeCourse?.code}/groups`,
      stats: "8 active groups",
    },
  ];

  const { mutate: enrollCourse } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(`/courses/${activeCourse?.id}/enroll`);
      return response.data;
    },
    mutationKey: ["enrollCourse", activeCourse?.code],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", activeCourse?.code] });
      toast.success("Course enrolled successfully");
      setShowConfirmDialog(false);
      setShowEnrollmentFlow(true);
    },
    onError: () => {
      toast.error("Failed to enroll in course");
      setShowConfirmDialog(false);
    },
  });

  const handleContinueToCourse = () => {
    setIsLoading(true);
    setActiveSection(course?.topics?.[0]?.sections?.[0] ?? null);
    setIsSidebarCollapsed(false);
    router.push(`/courses/${activeCourse?.code}/learn/${course?.topics?.[0]?.sections?.[0]?.slug ?? "1.1"}`);
  };

  return (
    <div className="space-y-8 mt-14 relative">
      {isLoading && <LoadingOverlay isOpen={isLoading} />}

      {/* Enrollment Flow Dialog */}
      <EnrollmentFlowDialog
        isOpen={showEnrollmentFlow}
        onClose={() => setShowEnrollmentFlow(false)}
        courseCode={activeCourse?.code as string}
        syllabusCode={course?.topics?.[0]?.sections?.[0]?.slug ?? "1.1"}
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Course Enrollment</DialogTitle>
            <DialogDescription>
              Are you sure you want to enroll in this course? You will have access to all course materials and can start
              learning right away.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => enrollCourse()}>Confirm Enrollment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course Header */}
      <div className="bg-background rounded-xl p-6 shadow">
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
              <Progress value={Number(course?.completion_percentage)} />
            </div>
            <div className="text-sm font-medium">{course?.completion_percentage}%</div>
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
              <p className="text-muted-foreground">{course?.description}</p>
            </CardContent>
          </Card>

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
                {course?.topics?.map((section: CourseTopic, index: number) => (
                  <AccordionItem
                    key={index}
                    value={`section-${index}`}
                  >
                    <AccordionTrigger>{section.title}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {section.sections.map((topic: CourseSection, topicIndex: number) => (
                          <div
                            key={topicIndex}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                              <span>{topic.title}</span>
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
                  className="w-full"
                  onClick={handleContinueToCourse}
                >
                  Continue to Course
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => setShowConfirmDialog(true)}
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
                <span className="font-medium">{course?.topics?.length}</span>
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
