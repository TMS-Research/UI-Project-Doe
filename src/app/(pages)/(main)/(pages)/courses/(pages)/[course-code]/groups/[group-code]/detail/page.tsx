"use client";

import Link from "next/link";
import GroupHeader from "./components/group-header";
import ResourcesSection from "./components/resources-section";
import GroupMembers from "./components/group-members";

// Mock data - replace with actual API call
const mockGroup = {
  id: "1",
  code: "MATH101-G1",
  name: "Advanced Mathematics Study Group",
  description:
    "A group for discussing advanced mathematics topics and solving complex problems together. We meet weekly to review concepts and work on challenging problems.",
  memberCount: 15,
  subject: "Mathematics",
  level: "Advanced",
  meetingTime: "Every Tuesday, 6:00 PM",
  resources: [
    {
      id: "1",
      title: "Calculus Notes - Chapter 1",
      type: "file" as const,
      url: "/files/calculus-notes-ch1.pdf",
      uploadedBy: "John Doe",
      uploadedAt: "2 hours ago",
    },
    {
      id: "2",
      title: "Linear Algebra Video Tutorial",
      type: "link" as const,
      url: "https://example.com/linear-algebra-tutorial",
      uploadedBy: "Jane Smith",
      uploadedAt: "1 day ago",
    },
    {
      id: "3",
      title: "Problem Set Solutions",
      type: "file" as const,
      url: "/files/problem-set-solutions.pdf",
      uploadedBy: "Alex Johnson",
      uploadedAt: "3 days ago",
    },
  ],
  members: [
    {
      id: "1",
      name: "John Doe",
      role: "admin" as const,
      avatar: "/avatars/john-doe.jpg",
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "member" as const,
      avatar: "/avatars/jane-smith.jpg",
    },
    {
      id: "3",
      name: "Alex Johnson",
      role: "member" as const,
      avatar: "/avatars/alex-johnson.jpg",
    },
  ],
};

export default function GroupDetailPage({ params }: { params: { "course-code": string; "group-code": string } }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href={`/courses/${params["course-code"]}/groups`}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
        >
          ← Back to Groups
        </Link>
      </div>

      {/* Group Header */}
      <GroupHeader
        name={mockGroup.name}
        description={mockGroup.description}
        subject={mockGroup.subject}
        memberCount={mockGroup.memberCount}
        meetingTime={mockGroup.meetingTime}
        level={mockGroup.level}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resources Section */}
        <div className="lg:col-span-2">
          <ResourcesSection resources={mockGroup.resources} />
        </div>

        {/* Members Section */}
        <div className="lg:col-span-1">
          <GroupMembers members={mockGroup.members} />
        </div>
      </div>
    </div>
  );
}
