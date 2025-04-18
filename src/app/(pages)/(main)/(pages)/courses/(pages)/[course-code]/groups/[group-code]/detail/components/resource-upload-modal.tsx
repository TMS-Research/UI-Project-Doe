import { useState } from "react";
import { Upload, Link as LinkIcon, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResourceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (resource: { title: string; type: "file" | "link"; url: string }) => void;
}

export default function ResourceUploadModal({ isOpen, onClose, onSubmit }: ResourceUploadModalProps) {
  const [resourceType, setResourceType] = useState<"file" | "link">("file");
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: resourceTitle,
      type: resourceType,
      url: resourceUrl,
    });
    setResourceTitle("");
    setResourceUrl("");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Resource Type</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={resourceType === "file" ? "light" : "ghost"}
                  onClick={() => setResourceType("file")}
                  className="flex-1"
                >
                  <FileText className="mr-2" />
                  File
                </Button>
                <Button
                  type="button"
                  variant={resourceType === "link" ? "light" : "ghost"}
                  onClick={() => setResourceType("link")}
                  className="flex-1"
                >
                  <LinkIcon className="mr-2" />
                  Link
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resource">{resourceType === "file" ? "Upload File" : "URL"}</Label>
              {resourceType === "file" ? (
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="flex text-sm text-muted-foreground">
                      <Label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                        />
                      </Label>
                    </div>
                  </div>
                </div>
              ) : (
                <Input
                  id="resource"
                  type="url"
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  placeholder="https://"
                  required
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">Share</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
