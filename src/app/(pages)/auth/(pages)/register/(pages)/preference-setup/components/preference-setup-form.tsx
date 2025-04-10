"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PreferenceSetupFormData, preferenceSetupSchema } from "../lib/validation";

const learningStyleOptions = [
  "Visual Learner",
  "Auditory Learner",
  "Reading/Writing Learner",
  "Kinesthetic Learner",
  "Mixed Style",
];

export default function PreferenceSetupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<PreferenceSetupFormData>({
    resolver: zodResolver(preferenceSetupSchema),
    defaultValues: {
      learningStyle: "",
      notificationEmail: true,
      notificationPush: true,
      notificationSMS: false,
    },
  });

  const onSubmit = async (data: PreferenceSetupFormData) => {
    try {
      setIsLoading(true);
      // TODO: Implement preference setup logic here
      console.log("Preference setup attempt with:", data);
    } catch (error) {
      console.error("Preference setup error:", error);
    } finally {
      setIsLoading(false);
      router.push("/dashboard"); // Redirect to dashboard after completion
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md space-y-8 m-auto">
      <div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Preferences Setup ⚙️</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Customize your learning experience
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="learningStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Learning Style Preference</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your learning style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {learningStyleOptions.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Notification Settings</h3>
            
            <FormField
              control={form.control}
              name="notificationEmail"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="!mt-0">Email Notifications</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notificationPush"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="!mt-0">Push Notifications</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notificationSMS"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="!mt-0">SMS Notifications</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleSkip}
            >
              Fill in Later
            </Button>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Complete Setup"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 