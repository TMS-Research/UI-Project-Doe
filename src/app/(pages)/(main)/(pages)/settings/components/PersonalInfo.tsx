"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PersonalInfo() {
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    studentId: "12345",
    major: "Computer Science",
    year: "3",
    interests: "AI, Web Development",
    bio: "Computer Science student passionate about AI and web development.",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleYearChange = (value: string) => {
    setFormData((prev) => ({ ...prev, year: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-2xl"
      >
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="studentId">Student ID</Label>
          <Input
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="major">Major</Label>
          <Input
            id="major"
            name="major"
            value={formData.major}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="year">Year</Label>
          <Select
            value={formData.year}
            onValueChange={handleYearChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1st Year</SelectItem>
              <SelectItem value="2">2nd Year</SelectItem>
              <SelectItem value="3">3rd Year</SelectItem>
              <SelectItem value="4">4th Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="interests">Academic Interests</Label>
          <Input
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
}
