"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Preferences() {
  const [preferences, setPreferences] = useState({
    studyReminders: true,
    emailNotifications: true,
    darkMode: false,
    language: "english",
    timezone: "UTC+7",
    studyGoal: "2",
  });

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Preferences</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-2xl"
      >
        <div className="flex items-center justify-between">
          <Label htmlFor="studyReminders">Enable study reminders</Label>
          <Switch
            id="studyReminders"
            checked={preferences.studyReminders}
            onCheckedChange={handleSwitchChange("studyReminders")}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="emailNotifications">Receive email notifications</Label>
          <Switch
            id="emailNotifications"
            checked={preferences.emailNotifications}
            onCheckedChange={handleSwitchChange("emailNotifications")}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="darkMode">Dark mode</Label>
          <Switch
            id="darkMode"
            checked={preferences.darkMode}
            onCheckedChange={handleSwitchChange("darkMode")}
          />
        </div>

        <div>
          <Label htmlFor="language">Language</Label>
          <Select
            value={preferences.language}
            onValueChange={handleSelectChange("language")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="indonesian">Indonesian</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="timezone">Timezone</Label>
          <Select
            value={preferences.timezone}
            onValueChange={handleSelectChange("timezone")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC+7">Jakarta (UTC+7)</SelectItem>
              <SelectItem value="UTC+8">Singapore (UTC+8)</SelectItem>
              <SelectItem value="UTC+9">Tokyo (UTC+9)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="studyGoal">Daily Study Goal (hours)</Label>
          <Select
            value={preferences.studyGoal}
            onValueChange={handleSelectChange("studyGoal")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select study goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 hour</SelectItem>
              <SelectItem value="2">2 hours</SelectItem>
              <SelectItem value="3">3 hours</SelectItem>
              <SelectItem value="4">4 hours</SelectItem>
              <SelectItem value="5">5 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full"
        >
          Save Preferences
        </Button>
      </form>
    </div>
  );
}
