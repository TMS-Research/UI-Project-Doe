"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import GroupCard from "@/app/(pages)/(main)/(pages)/courses/(pages)/[course-code]/groups/components/group-card";
import { Input } from "@/components/ui/input";

interface StudyGroup {
  id: string;
  code: string;
  name: string;
  description: string;
  memberCount: number;
  subject: string;
  level: string;
}

// Mock data - replace with actual API call
const mockGroups: StudyGroup[] = [
  {
    id: "1",
    code: "MATH101-G1",
    name: "Advanced Mathematics Study Group",
    description: "A group for discussing advanced mathematics topics and solving complex problems together.",
    memberCount: 15,
    subject: "Mathematics",
    level: "Advanced",
  },
  {
    id: "2",
    code: "PHYS101-G1",
    name: "Physics Fundamentals",
    description: "Study group for physics fundamentals and problem-solving techniques.",
    memberCount: 12,
    subject: "Physics",
    level: "Intermediate",
  },
  {
    id: "3",
    code: "CS101-G1",
    name: "Programming Basics",
    description: "Learn programming fundamentals and practice coding together.",
    memberCount: 20,
    subject: "Computer Science",
    level: "Beginner",
  },
];

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = mockGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Study Groups</h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            className="pl-9"
            placeholder="Search groups by name, subject, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search study groups"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
          />
        ))}
      </div>
    </div>
  );
}
