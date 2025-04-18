import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { CheckCircle, PlayCircle, FileText, BookOpen, MessageCircle, Download } from "lucide-react";

interface LearningMaterial {
  type: "video" | "document" | "quiz";
  title: string;
  duration?: string;
  completed?: boolean;
}

export function CourseContent() {
  const materials: LearningMaterial[] = [
    { type: "video", title: "Introduction to Data Structures", duration: "10:25", completed: true },
    { type: "document", title: "Basic Concepts and Terminology", duration: "15 min read" },
    { type: "video", title: "Arrays and Linked Lists", duration: "15:30" },
    { type: "document", title: "Practice Problems - Part 1", duration: "20 min read" },
    { type: "quiz", title: "Knowledge Check: Basic Data Structures" },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <section className="bg-background rounded-xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p className="text-gray-600 mb-4">
          In this lesson, we&apos;ll explore the fundamental concepts of data structures. You&apos;ll learn about
          different types of data organizations and their practical applications in computer science.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="p-4 flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Reading Time</p>
              <p className="font-medium">35 minutes</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <PlayCircle className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Video Content</p>
              <p className="font-medium">25 minutes</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Discussion</p>
              <p className="font-medium">Active</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Learning Materials Section */}
      <section className="bg-background rounded-xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-4">Learning Materials</h2>
        <div className="space-y-4">
          {materials.map((material, index) => (
            <Card
              key={index}
              className="p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {material.type === "video" && <PlayCircle className="h-5 w-5 text-primary" />}
                  {material.type === "document" && <FileText className="h-5 w-5 text-primary" />}
                  {material.type === "quiz" && <MessageCircle className="h-5 w-5 text-primary" />}
                  <div>
                    <h3 className="font-medium">{material.title}</h3>
                    {material.duration && <p className="text-sm text-gray-500">{material.duration}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {material.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      Start
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Resources Section */}
      <section className="bg-background rounded-xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Lecture Slides</h3>
                <p className="text-sm text-gray-500">PDF, 2.5MB</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                Download
              </Button>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Practice Exercises</h3>
                <p className="text-sm text-gray-500">PDF, 1.8MB</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                Download
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
