"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Facebook, Linkedin, MessageCircle, Share2, Twitter, Users } from "lucide-react";
import Link from "next/link";

export default function CorridorPage() {
  const courseInfo = {
    title: "Introduction to Computer Science",
    code: "CS101",
    instructor: "Dr. Alan Turing",
    progress: 65,
    description:
      "This course provides a broad introduction to computer science and teaches the basics of programming using Python. Students will learn fundamental concepts such as algorithms, data structures, and computational problem solving. No prior programming experience is required.",
    department: "Computer Science",
    credits: 3,
    term: "Fall 2023",
    level: "Undergraduate",
    learningObjectives: [
      "Understand fundamental concepts in computer science",
      "Learn basic programming principles and syntax in Python",
      "Develop algorithmic thinking and problem-solving skills",
      "Build simple applications and understand software development concepts",
    ],
    prerequisites: ["None"],
    syllabus: [
      {
        title: "Introduction and Computational Thinking",
        topics: [
          {
            title: "Course Overview and Introduction to Computer Science",
            duration: "1 hour",
          },
          {
            title: "Computational Thinking and Problem Solving",
            duration: "1 hour",
          },
          {
            title: "Binary and Data Representation",
            duration: "1 hour",
          },
        ],
      },
      {
        title: "Python Fundamentals",
        topics: [
          {
            title: "Introduction to Python and Basic Syntax",
            duration: "1 hour",
          },
          {
            title: "Variables, Data Types, and Operators",
            duration: "1 hour",
          },
          {
            title: "Control Flow: Conditionals and Loops",
            duration: "1 hour",
          },
        ],
      },
      {
        title: "Advanced Python",
        topics: [
          {
            title: "Functions and Modules",
            duration: "1 hour",
          },
          {
            title: "Object-Oriented Programming",
            duration: "1 hour",
          },
          {
            title: "Error Handling and Debugging",
            duration: "1 hour",
          },
        ],
      },
      {
        title: "Algorithms and Applications",
        topics: [
          {
            title: "Basic Algorithms and Problem Solving",
            duration: "1 hour",
          },
          {
            title: "Data Structures",
            duration: "1 hour",
          },
          {
            title: "Final Project and Review",
            duration: "1 hour",
          },
        ],
      },
    ],
  };

  const corridorSections = [
    {
      title: "Discussion Forum",
      description: "Engage with your peers and instructors",
      icon: <MessageCircle className="w-6 h-6" />,
      href: `/courses/${courseInfo.code}/forum`,
      stats: "156 discussions",
    },
    {
      title: "Study Groups",
      description: "Join or create study groups",
      icon: <Users className="w-6 h-6" />,
      href: `/courses/${courseInfo.code}/groups`,
      stats: "8 active groups",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex flex-col gap-4">
          <div>
            <div className="inline-flex px-2 py-1 rounded-full text-sm bg-primary/10 text-primary mb-2">
              {courseInfo.code}
            </div>
            <h1 className="text-2xl font-bold">{courseInfo.title}</h1>
            <p className="text-muted-foreground">Instructor: {courseInfo.instructor}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Course Progress</div>
            <div className="flex-1">
              <Progress value={courseInfo.progress} />
            </div>
            <div className="text-sm font-medium">{courseInfo.progress}%</div>
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
              <p className="text-gray-600">{courseInfo.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {courseInfo.learningObjectives.map((objective, index) => (
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
                {courseInfo.prerequisites.map((prerequisite, index) => (
                  <li key={index}>{prerequisite}</li>
                ))}
              </ul>
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
                {courseInfo.syllabus.map((section, index) => (
                  <AccordionItem
                    key={index}
                    value={`section-${index}`}
                  >
                    <AccordionTrigger>{section.title}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {section.topics.map((topic, topicIndex) => (
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
                              <span>{topic.duration}</span>
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
              <Button
                asChild
                className="w-full"
              >
                <Link href={`/courses/${courseInfo.code}/learn/1.1`}>Continue to Course</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium">{courseInfo.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Course Code:</span>
                <span className="font-medium">{courseInfo.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Credits:</span>
                <span className="font-medium">{courseInfo.credits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Term:</span>
                <span className="font-medium">{courseInfo.term}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Level:</span>
                <span className="font-medium">{courseInfo.level}</span>
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
