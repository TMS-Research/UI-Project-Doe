"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Account() {
  const [email, setEmail] = useState("john.doe@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Account Settings</h2>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Profile Picture</h3>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200" />
          <Button variant="outline">Change Photo</Button>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Email Address</h3>
        <div className="max-w-md">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Change Password</h3>
        <form
          onSubmit={handleSubmit}
          className="max-w-md space-y-4"
        >
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
