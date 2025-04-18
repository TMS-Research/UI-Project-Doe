import { Button } from "@/components/ui/button";
import Link from "next/link";

interface StudyGroup {
  id: string;
  code: string;
  name: string;
  description: string;
  memberCount: number;
  subject: string;
  level: string;
}

interface GroupCardProps {
  group: StudyGroup;
}

export default function GroupCard({ group }: GroupCardProps) {
  return (
    <div className="bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {group.subject}
          </span>
          <span className="text-gray-500">{group.memberCount} members</span>
        </div>
        <div className="mt-4">
          <Button
            asChild
            variant="default"
            className="w-full"
          >
            <Link href={`/courses/${group.code.split("-")[0]}/groups/${group.code}/detail`}>View Group</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
