import { useState } from "react";
import ResourceCard from "./resource-card";
import ResourceUploadModal from "./resource-upload-modal";
import { Button } from "@/components/ui/button";

interface Resource {
  id: string;
  title: string;
  type: "file" | "link";
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface ResourcesSectionProps {
  resources: Resource[];
}

export default function ResourcesSection({ resources }: ResourcesSectionProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleResourceSubmit = (resource: { title: string; type: "file" | "link"; url: string }) => {
    // Handle resource submission logic here
    console.log("Resource submitted:", resource);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="bg-background rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Shared Resources</h2>
        <Button onClick={() => setIsUploadModalOpen(true)}>Share Resource</Button>
      </div>

      <div className="space-y-4">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
          />
        ))}
      </div>

      <ResourceUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleResourceSubmit}
      />
    </div>
  );
}
