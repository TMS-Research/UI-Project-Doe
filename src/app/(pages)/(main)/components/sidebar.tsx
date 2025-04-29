"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import useLayoutStore from "@/stores/layout-store";
import { useCoursesStore } from "@/stores/courses-store";
import { Book, FileText, Home, List, Plus, Settings, Trophy, Upload, Video, BarChart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import SyllabusStepper from "./syllabus-stepper";
import axiosInstance from "@/app/api/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

// Define a type for the resource
interface Resource {
  id: string;
  title: string;
  resource_type: string;
  url?: string;
}

export default function Sidebar() {
  const { sidebarContent, setSidebarContent, isSidebarCollapsed } = useLayoutStore();
  const pathname = usePathname();
  const [isViewerDialogOpen, setIsViewerDialogOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [resourceType, setResourceType] = useState<string | null>(null);

  // Add a function to handle viewing resources inline
  const handleViewResourceInline = async (resource: Resource) => {
    try {
      // For now, we'll use dummy files from the public directory
      let dummyUrl = "";
      if (resource.resource_type === "vid") {
        dummyUrl = "/sample-video.mp4"; // Add a sample video to your public folder
      } else {
        dummyUrl = "/20220411134754_LN05 - Hashing.pdf";
      }

      // Log the resource being viewed
      console.log(`Viewing resource inline: ${resource.title} (${resource.resource_type})`);

      // In the future, this will be replaced with:
      // 1. API call to get the blob from BE
      // 2. Create a blob URL from the response
      // 3. Set the blob URL to the iframe/video src

      // Example of future implementation:
      /*
      const response = await axiosInstance.get(`/api/resources/${resource.id}/download`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const blobUrl = URL.createObjectURL(blob);
      
      // Set the blob URL to the iframe/video src
      setDocumentUrl(blobUrl);
      setResourceType(resource.resource_type);
      
      // Clean up the blob URL when the dialog is closed
      return () => {
        URL.revokeObjectURL(blobUrl);
      };
      */

      // For now, just set the dummy URL
      setDocumentUrl(dummyUrl);
      setResourceType(resource.resource_type);
      setIsViewerDialogOpen(true);
    } catch (error) {
      console.error("Error viewing resource inline:", error);
      toast.error("Failed to open resource. Please try again later.");
    }
  };

  useEffect(() => {
    if (pathname.includes("/courses") && pathname.includes("/learn")) {
      setSidebarContent("syllabus");
    } else {
      setSidebarContent("default");
    }
  }, [pathname, setSidebarContent]);

  // Clean up document URL when dialog is closed
  useEffect(() => {
    if (!isViewerDialogOpen && documentUrl) {
      // In a real implementation, this would revoke the blob URL
      // URL.revokeObjectURL(documentUrl);
      setDocumentUrl(null);
      setResourceType(null);
    }
  }, [isViewerDialogOpen, documentUrl]);

  return sidebarContent === "default" ? (
    <AnimatePresence>
      <DefaultSidebar isCollapsed={isSidebarCollapsed} />
    </AnimatePresence>
  ) : (
    <AnimatePresence>
      <SyllabusSidebar
        isCollapsed={isSidebarCollapsed}
        isViewerDialogOpen={isViewerDialogOpen}
        setIsViewerDialogOpen={setIsViewerDialogOpen}
        documentUrl={documentUrl}
        resourceType={resourceType}
        handleViewResourceInline={handleViewResourceInline}
      />
    </AnimatePresence>
  );
}

interface SidebarProps {
  isCollapsed: boolean;
}

const DefaultSidebar = ({ isCollapsed }: SidebarProps) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "My Stats", icon: <BarChart />, href: "/my-stats" },
    { name: "Dashboard", icon: <Home />, href: "/dashboard" },
    { name: "Courses", icon: <Book />, href: "/courses" },
    { name: "Leaderboard", icon: <Trophy />, href: "/leaderboard" },
    { name: "Settings", icon: <Settings />, href: "/settings" },
  ];

  return (
    <motion.div
      initial={{ width: isCollapsed ? "5rem" : "16rem" }}
      animate={{ width: isCollapsed ? "5rem" : "16rem" }}
      exit={{ width: "5rem" }}
      transition={{ duration: 0.3 }}
      className={cn(
        "h-screen overflow-hidden pt-[62px] text-foreground flex flex-col border-r sticky top-0 left-0 z-40 bg-background flex-[0_0_auto]",
        isCollapsed && "border-r-0",
      )}
    >
      <ul className={cn("px-3 space-y-2 mt-4", isCollapsed ? "w-[5rem]" : "w-[16rem]")}>
        {menuItems.map((item) => (
          <li key={item.name}>
            <Button
              asChild
              variant={pathname === item.href ? "light" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname == item.href ? "text-primary" : "text-foreground",
                isCollapsed && "justify-center",
              )}
            >
              <Link
                href={item.href}
                className={cn("flex items-center gap-2", isCollapsed && "justify-center")}
                title={isCollapsed ? item.name : undefined}
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const SyllabusSidebar = ({
  isCollapsed,
  isViewerDialogOpen,
  setIsViewerDialogOpen,
  documentUrl,
  resourceType,
  handleViewResourceInline,
}: SidebarProps & {
  isViewerDialogOpen: boolean;
  setIsViewerDialogOpen: (open: boolean) => void;
  documentUrl: string | null;
  resourceType: string | null;
  handleViewResourceInline: (resource: Resource) => Promise<void>;
}) => {
  const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [uploadType, setUploadType] = useState<"file" | "youtube">("file");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { activeCourse } = useCoursesStore();
  const { user } = useAuthStore();

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Fetch resources query
  const { data: resources, isLoading: isLoadingResources } = useQuery({
    queryKey: ["resources", activeCourse?.id, user?.id],
    queryFn: async () => {
      if (!activeCourse?.id) return [];

      // Remove trailing slash from endpoint
      const response = await axiosInstance.get(`/student-resources?course_id=${activeCourse.id}&user_id=${user?.id}`);
      return response.data;
    },
    enabled: !!activeCourse?.id,
  });

  // Detect file type based on file extension
  const detectFileType = (file: File): "document" | "audio" | "image" | null => {
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (["pdf", "doc", "docx", "txt", "rtf", "odt", "xls", "xlsx", "ppt", "pptx"].includes(extension || "")) {
      return "document";
    } else if (["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(extension || "")) {
      return "audio";
    } else if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(extension || "")) {
      return "image";
    }
    return null; // Return null for unsupported file types (including videos)
  };

  // Upload content mutation
  const { mutate: uploadContent } = useMutation({
    mutationFn: async () => {
      if (uploadType === "youtube") {
        if (!youtubeUrl) {
          throw new Error("No YouTube URL provided");
        }

        const videoData: FormData = new FormData();
        videoData.append("course_id", activeCourse?.id || "");
        videoData.append("video_url", youtubeUrl);

        const response = await axiosInstance.postForm("/student-resources/video", videoData);
        return response.data;
      }

      // Existing file upload logic for other types
      if (!selectedFile) {
        throw new Error("No file selected");
      }

      // Start the mock progress
      setUploadProgress(0);
      progressIntervalRef.current = setInterval(() => {
        setUploadProgress((prev) => {
          const increment = Math.max(1, Math.floor((100 - prev) / 10));
          return Math.min(prev + increment, 95);
        });
      }, 2000);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", selectedFile.name);

      if (activeCourse?.id) {
        formData.append("course_id", activeCourse.id);
      }

      // Determine endpoint based on detected file type
      const fileType = detectFileType(selectedFile);
      let endpoint = "/student-resources/document";

      switch (fileType) {
        case "document":
          endpoint = "/student-resources/document";
          break;
        case "audio":
          endpoint = "/student-resources/audio";
          break;
        case "image":
          endpoint = "/student-resources/image";
          break;
      }

      const response = await axiosInstance.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onMutate: () => {
      setIsUploading(true);
    },
    onSuccess: () => {
      // Clear the interval and set progress to 100%
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setUploadProgress(100);

      // Wait a moment to show 100% before closing
      setTimeout(() => {
        toast.success("Resource uploaded successfully");
        // Reset all states
        setSelectedFile(null);
        setUploadProgress(0);
        setIsDragging(false);
        setIsAddResourceDialogOpen(false);
      }, 500);
    },
    onError: (error) => {
      // Clear the interval on error
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setUploadProgress(0);
      toast.error("Failed to upload resource");
      console.error("Error uploading resource:", error);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const extractYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const validateYoutubeUrl = (url: string): boolean => {
    const videoId = extractYoutubeVideoId(url);
    return videoId !== null;
  };

  const handleAddResource = () => {
    uploadContent();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileType = detectFileType(file);

      if (!fileType) {
        toast.error("Unsupported file type. Please upload a document, audio, or image file.");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const fileType = detectFileType(file);

      if (!fileType) {
        toast.error("Unsupported file type. Please upload a document, audio, or image file.");
        return;
      }

      setSelectedFile(file);
    }
  };

  // Reset all form states
  const resetUploadStates = () => {
    setSelectedFile(null);
    setYoutubeUrl("");
    setUploadType("file");
    setIsDragging(false);
    setUploadProgress(0);
  };

  return (
    <motion.div
      initial={{ width: isCollapsed ? "0px" : "20rem" }}
      animate={{ width: isCollapsed ? "0px" : "20rem" }}
      exit={{ width: "0px" }}
      transition={{ duration: 0.3 }}
      className={cn(
        "h-screen overflow-hidden pt-[62px] text-primary-foreground flex flex-col border-r sticky top-0 left-0 z-40 bg-background flex-[0_0_auto]",
        isCollapsed && "border-r-0",
      )}
    >
      {/* Top section - Syllabus Navigation */}
      {!isCollapsed && <SyllabusStepper />}

      {/* Bottom section - Resources */}
      <div className={cn("p-4 border-t flex flex-col flex-1", isCollapsed && "hidden")}>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search resources..."
              className="flex-1"
            />
            <Popover>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-foreground"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View resource types</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <PopoverContent className="w-80 bg-background">
                <div className="space-y-2">
                  <h4 className="font-medium text-primary">Resources</h4>
                  <div className="flex-1 w-full max-h-[300px] overflow-y-auto overflow-x-hidden">
                    <div className="space-y-2 w-full">
                      {isLoadingResources ? (
                        <div className="text-center text-muted-foreground">Loading resources...</div>
                      ) : resources?.length === 0 ? (
                        <div className="text-center text-muted-foreground">No resources available</div>
                      ) : (
                        resources?.map((resource: Resource) => (
                          <TooltipProvider key={resource.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  key={resource.id}
                                  variant="light"
                                  className="w-full justify-start overflow-hidden"
                                  onClick={() => {
                                    handleViewResourceInline(resource).catch((error) => {
                                      console.error("Error in onClick handler:", error);
                                    });
                                  }}
                                >
                                  <div className="flex items-start gap-2 overflow-hidden">
                                    {resource.resource_type === "doc" && (
                                      <FileText className="h-4 w-4 mt-1 text-primary" />
                                    )}
                                    {resource.resource_type === "vid" && (
                                      <Video className="h-4 w-4 mt-1 text-primary" />
                                    )}
                                    {resource.resource_type === "audio" && (
                                      <Video className="h-4 w-4 mt-1 text-primary" />
                                    )}
                                    {resource.resource_type === "img" && (
                                      <FileText className="h-4 w-4 mt-1 text-primary" />
                                    )}
                                    <div className="flex-1 min-w-0 text-left w-full">
                                      <p className="text-sm font-medium truncate">{resource.title}</p>
                                    </div>
                                  </div>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{resource.title}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="text-foreground"
                    onClick={() => setIsAddResourceDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add new resource</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Document/Media Viewer Dialog */}
      <Dialog
        open={isViewerDialogOpen}
        onOpenChange={setIsViewerDialogOpen}
      >
        <DialogContent className="sm:max-w-4xl h-[90vh] p-0">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle>{resourceType === "vid" ? "Video Player" : "Document Viewer"}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full h-[calc(90vh-4rem)]">
            {documentUrl &&
              (resourceType === "vid" ? (
                <video
                  src={documentUrl}
                  className="w-full h-full"
                  controls
                  autoPlay
                  controlsList="nodownload"
                />
              ) : (
                <iframe
                  src={documentUrl}
                  className="w-full h-full"
                  title="Document Viewer"
                />
              ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Resource Dialog */}
      <Dialog
        open={isAddResourceDialogOpen}
        onOpenChange={(open) => {
          setIsAddResourceDialogOpen(open);
          if (!open) {
            resetUploadStates();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
          </DialogHeader>

          <Tabs
            defaultValue="file"
            className="w-full"
            onValueChange={(value) => {
              setUploadType(value as "file" | "youtube");
              if (value === "file") {
                setYoutubeUrl("");
              } else {
                setSelectedFile(null);
              }
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">Upload File</TabsTrigger>
              <TabsTrigger value="youtube">YouTube Video</TabsTrigger>
            </TabsList>
            <TabsContent
              value="file"
              className="mt-4"
            >
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                  selectedFile ? "border-primary bg-primary/5" : "",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      {detectFileType(selectedFile) === "document" && <FileText className="h-8 w-8 text-primary" />}
                      {detectFileType(selectedFile) === "audio" && <Video className="h-8 w-8 text-primary" />}
                      {detectFileType(selectedFile) === "image" && <FileText className="h-8 w-8 text-primary" />}
                      <p className="font-medium">{selectedFile.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(detectFileType(selectedFile) ?? "unknown").charAt(0).toUpperCase() +
                        (detectFileType(selectedFile) ?? "unknown").slice(1)}{" "}
                      file
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-center font-medium">Drag and drop your file here</p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-2">Supported files: documents, audio, and images</p>
                  </>
                )}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.xls,.xlsx,.ppt,.pptx,.mp3,.wav,.ogg,.m4a,.aac,.flac,.jpg,.jpeg,.png,.gif,.webp,.svg,.bmp"
                  onChange={handleFileChange}
                />
              </div>
            </TabsContent>
            <TabsContent
              value="youtube"
              className="mt-4 space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="youtube-url">YouTube Video URL</Label>
                <Input
                  id="youtube-url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Paste a YouTube video URL to embed it in your resources.
                </p>
              </div>
              {youtubeUrl && !validateYoutubeUrl(youtubeUrl) && (
                <p className="text-sm text-destructive">Please enter a valid YouTube URL</p>
              )}
              {youtubeUrl && validateYoutubeUrl(youtubeUrl) && (
                <div className="rounded-md border overflow-hidden aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${extractYoutubeVideoId(youtubeUrl)}`}
                    title="YouTube video preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress
                value={uploadProgress}
                className="h-2"
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddResourceDialogOpen(false);
                resetUploadStates();
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddResource}
              disabled={
                (uploadType === "file" && !selectedFile) ||
                (uploadType === "youtube" && (!youtubeUrl || !validateYoutubeUrl(youtubeUrl))) ||
                isUploading
              }
            >
              {isUploading ? "Uploading..." : "Add Resource"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
