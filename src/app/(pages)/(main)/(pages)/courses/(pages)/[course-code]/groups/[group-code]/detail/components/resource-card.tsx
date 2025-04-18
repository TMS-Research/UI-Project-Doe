import { FileText, Link as LinkIcon } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  type: "file" | "link";
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        {resource.type === "file" ? (
          <FileText className="h-6 w-6 text-blue-500" />
        ) : (
          <LinkIcon className="h-6 w-6 text-blue-500" />
        )}
        <div>
          <h3 className="text-sm font-medium text-gray-900">{resource.title}</h3>
          <p className="text-sm text-gray-500">
            Shared by {resource.uploadedBy} • {resource.uploadedAt}
          </p>
        </div>
      </div>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:text-blue-500"
      >
        View
      </a>
    </div>
  );
}
