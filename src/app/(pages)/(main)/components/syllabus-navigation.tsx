"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Book } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Sample syllabus data - in a real app, this would come from an API or database
const syllabusData = [
  {
    id: "chapter1",
    title: "Introduction to the Course",
    subchapters: [
      { id: "1.1", title: "Course Overview", href: "/courses/CS101/learn/1.1" },
      { id: "1.2", title: "Learning Objectives", href: "/courses/CS101/learn/1.2" },
      { id: "1.3", title: "Course Requirements", href: "/courses/CS101/learn/1.3" },
    ],
  },
  {
    id: "chapter2",
    title: "Fundamental Concepts",
    subchapters: [
      { id: "2.1", title: "Basic Principles", href: "/courses/CS101/learn/2.1" },
      { id: "2.2", title: "Key Terminology", href: "/courses/CS101/learn/2.2" },
      { id: "2.3", title: "Historical Context", href: "/courses/CS101/learn/2.3" },
    ],
  },
  {
    id: "chapter3",
    title: "Advanced Topics",
    subchapters: [
      { id: "3.1", title: "Complex Systems", href: "/courses/CS101/learn/3.1" },
      { id: "3.2", title: "Practical Applications", href: "/courses/CS101/learn/3.2" },
      { id: "3.3", title: "Future Developments", href: "/courses/CS101/learn/3.3" },
    ],
  },
  {
    id: "chapter4",
    title: "Practical Exercises",
    subchapters: [
      { id: "4.1", title: "Lab Work", href: "/courses/CS101/learn/4.1" },
      { id: "4.2", title: "Case Studies", href: "/courses/CS101/learn/4.2" },
      { id: "4.3", title: "Group Projects", href: "/courses/CS101/learn/4.3" },
    ],
  },
];

export default function SyllabusNavigation() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full w-[20rem]">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-foreground">Course Syllabus</h2>
        <p className="text-xs text-muted-foreground">Navigate through course content</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Accordion
          type="single"
          className="w-full"
        >
          {syllabusData.map((chapter) => (
            <AccordionItem
              key={chapter.id}
              value={chapter.id}
            >
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2 text-foreground">
                  <Book className="h-4 w-4 text-primary" />
                  <span>{chapter.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-4 space-y-1">
                  {chapter.subchapters.map((subchapter) => (
                    <Link
                      key={subchapter.id}
                      href={subchapter.href}
                      className={cn(
                        "flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-colors",
                        pathname === subchapter.href
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {subchapter.title}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
