import { Users, Calendar, BookOpen } from "lucide-react";

interface GroupHeaderProps {
  name: string;
  description: string;
  subject: string;
  memberCount: number;
  meetingTime: string;
  level: string;
}

export default function GroupHeader({ name, description, subject, memberCount, meetingTime, level }: GroupHeaderProps) {
  return (
    <div className="bg-background rounded-lg shadow-sm p-6 mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex flex-wrap gap-4 items-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {subject}
        </span>
        <span className="inline-flex items-center text-gray-500">
          <Users className="h-4 w-4 mr-1" />
          {memberCount} members
        </span>
        <span className="inline-flex items-center text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          {meetingTime}
        </span>
        <span className="inline-flex items-center text-gray-500">
          <BookOpen className="h-4 w-4 mr-1" />
          {level}
        </span>
      </div>
    </div>
  );
}
