"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/app/api/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Section {
  title: string;
  description: string;
  section_order: number;
  content: Record<string, any>;
  duration_minutes: number;
  is_published: number;
}

interface CourseFormData {
  title: string;
  code: string;
  description: string;
  instructor_info: Record<string, any>;
  category: string;
  difficulty_level: string;
  sections: Section[];
}

interface DocumentUploadData {
  file: File | null;
  title: string;
  code: string;
  category: string;
  difficulty_level: string;
  instructor_info: string;
  chunk_overlap: number;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    code: "",
    description: "",
    instructor_info: {},
    category: "",
    difficulty_level: "",
    sections: [],
  });

  const [documentData, setDocumentData] = useState<DocumentUploadData>({
    file: null,
    title: "",
    code: "",
    category: "",
    difficulty_level: "",
    instructor_info: "",
    chunk_overlap: 500,
  });

  const [sections, setSections] = useState<Section[]>([]);

  const handleAddSection = () => {
    const newSection: Section = {
      title: "",
      description: "",
      section_order: sections.length,
      content: {},
      duration_minutes: 0,
      is_published: 0,
    };
    setSections([...sections, newSection]);
  };

  const handleSectionChange = (index: number, field: keyof Section, value: any) => {
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value,
    };
    setSections(updatedSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const courseData = {
        ...formData,
        sections: sections,
      };

      await axiosInstance.post("/api/v1/courses", courseData);
      toast.success("Course created successfully!");
      router.push("/courses");
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentData.file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", documentData.file);
    formData.append("title", documentData.title);
    formData.append("code", documentData.code);
    formData.append("category", documentData.category);
    formData.append("difficulty_level", documentData.difficulty_level);
    formData.append("instructor_info", documentData.instructor_info);
    formData.append("chunk_overlap", documentData.chunk_overlap.toString());

    try {
      await axiosInstance.post("/document-processing/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Document uploaded successfully!");
      router.push("/courses");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8 mt-14">
      <div>
        <h1 className="text-2xl font-bold mb-2">Create New Course</h1>
        <p className="text-gray-600">Choose a method to create your course</p>
      </div>

      <Tabs defaultValue="manual">
        <TabsList className="bg-transparent px-0 mb-4">
          <TabsTrigger
            value="manual"
            className="px-6 py-3 text-md rounded-full"
          >
            Manual Creation
          </TabsTrigger>
          <TabsTrigger
            value="upload"
            className="px-6 py-3 text-md rounded-full"
          >
            Document Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="manual"
          className="space-y-6"
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code">Course Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty_level">Difficulty Level</Label>
                    <Select
                      value={formData.difficulty_level}
                      onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Course Sections</CardTitle>
                <Button
                  type="button"
                  onClick={handleAddSection}
                  className="w-fit"
                >
                  Add Section
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {sections.map((section, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Section Title</Label>
                          <Input
                            value={section.title}
                            onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Duration (minutes)</Label>
                          <Input
                            type="number"
                            value={section.duration_minutes}
                            onChange={(e) => handleSectionChange(index, "duration_minutes", parseInt(e.target.value))}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Section Description</Label>
                        <Textarea
                          value={section.description}
                          onChange={(e) => handleSectionChange(index, "description", e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Label>Published</Label>
                        <input
                          type="checkbox"
                          checked={section.is_published === 1}
                          onChange={(e) => handleSectionChange(index, "is_published", e.target.checked ? 1 : 0)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/courses")}
                className="w-fit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-fit"
              >
                {isSubmitting ? "Creating..." : "Create Course"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent
          value="upload"
          className="space-y-6"
        >
          <form
            onSubmit={handleDocumentUpload}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Upload Document</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document">Course Document</Label>
                  <Input
                    id="document"
                    type="file"
                    onChange={(e) => setDocumentData({ ...documentData, file: e.target.files?.[0] || null })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doc-title">Course Title</Label>
                  <Input
                    id="doc-title"
                    value={documentData.title}
                    onChange={(e) => setDocumentData({ ...documentData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doc-code">Course Code</Label>
                  <Input
                    id="doc-code"
                    value={documentData.code}
                    onChange={(e) => setDocumentData({ ...documentData, code: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doc-category">Category</Label>
                  <Input
                    id="doc-category"
                    value={documentData.category}
                    onChange={(e) => setDocumentData({ ...documentData, category: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doc-difficulty">Difficulty Level</Label>
                  <Select
                    value={documentData.difficulty_level}
                    onValueChange={(value) => setDocumentData({ ...documentData, difficulty_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doc-instructor">Instructor Info</Label>
                  <Textarea
                    id="doc-instructor"
                    value={documentData.instructor_info}
                    onChange={(e) => setDocumentData({ ...documentData, instructor_info: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chunk-overlap">Chunk Overlap</Label>
                  <Input
                    id="chunk-overlap"
                    type="number"
                    value={documentData.chunk_overlap}
                    onChange={(e) => setDocumentData({ ...documentData, chunk_overlap: parseInt(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/courses")}
                className="w-fit"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading}
                className="w-fit"
              >
                {isUploading ? "Uploading..." : "Upload Document"}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
