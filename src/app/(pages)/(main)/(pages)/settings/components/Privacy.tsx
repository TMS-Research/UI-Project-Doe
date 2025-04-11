"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Privacy() {
  const [privacySettings, setPrivacySettings] = useState({
    shareProgress: true,
    shareAnonymousData: false,
    dataRetention: "1",
    allowTracking: true,
  });

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setPrivacySettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (value: string) => {
    setPrivacySettings((prev) => ({ ...prev, dataRetention: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Privacy Controls</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 max-w-2xl"
      >
        <div>
          <h3 className="text-lg font-medium mb-4">Data Sharing</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="shareProgress"
                  className="font-medium"
                >
                  Share learning progress with instructors
                </Label>
                <p className="text-sm text-gray-500">Allow instructors to view your course progress and performance</p>
              </div>
              <Switch
                id="shareProgress"
                checked={privacySettings.shareProgress}
                onCheckedChange={handleSwitchChange("shareProgress")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="shareAnonymousData"
                  className="font-medium"
                >
                  Share activity for research purposes (anonymized)
                </Label>
                <p className="text-sm text-gray-500">Help improve our platform with anonymous usage data</p>
              </div>
              <Switch
                id="shareAnonymousData"
                checked={privacySettings.shareAnonymousData}
                onCheckedChange={handleSwitchChange("shareAnonymousData")}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Data Retention</h3>
          <div>
            <Label htmlFor="dataRetention">
              Keep my learning data for <span className="text-red-600">*</span>
            </Label>
            <Select
              value={privacySettings.dataRetention}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select retention period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 year</SelectItem>
                <SelectItem value="2">2 years</SelectItem>
                <SelectItem value="3">3 years</SelectItem>
                <SelectItem value="forever">Forever</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Usage Analytics</h3>
          <div className="flex items-center justify-between">
            <div>
              <Label
                htmlFor="allowTracking"
                className="font-medium"
              >
                Allow usage tracking to improve the service
              </Label>
              <p className="text-sm text-gray-500">
                This helps us understand how you use the platform and improve our features
              </p>
            </div>
            <Switch
              id="allowTracking"
              checked={privacySettings.allowTracking}
              onCheckedChange={handleSwitchChange("allowTracking")}
            />
          </div>
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
