"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AcademicProfileFormData, academicProfileSchema } from "../lib/validation";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/api/axios";

const yearOptions = ["First Year", "Second Year", "Third Year", "Fourth Year", "Graduate Student", "Other"];

export default function AcademicProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  useEffect(() => {
    if (!from || from !== "basic-info") {
      router.push("/register");
    }
  }, [from, router]);

  const { data: aspirations } = useQuery({
    queryKey: ["aspirations"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users/aspirations");
      return response.data;
    },
  });

  const form = useForm<AcademicProfileFormData>({
    resolver: zodResolver(academicProfileSchema),
    defaultValues: {
      school: "",
      major: "",
      year: "",
      careerGoals: "",
    },
  });

  const onSubmit = async (data: AcademicProfileFormData) => {
    try {
      setIsLoading(true);
      // TODO: Implement academic profile update logic here
      console.log("Academic profile update attempt with:", data);
    } catch (error) {
      console.error("Academic profile update error:", error);
    } finally {
      setIsLoading(false);
      router.push("/auth/register/preference-setup");
    }
  };

  const handleSkip = () => {
    toast("Skipping Academic Profile", {
      description: "You can always update your academic profile later.",
    });
    // router.push("/register/preference-setup");
  };

  return (
    <div className="w-full max-w-md space-y-8 m-auto">
      <div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Academic Profile 📚</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Tell us about your academic background</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School/University</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your school or university name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="major"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Major/Program of Study</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your major or program"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Year/Semester</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem
                        key={year}
                        value={year}
                      >
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Career Goals (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your career goals" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {aspirations?.map((aspiration: any) => (
                      <SelectItem
                        key={aspiration.id}
                        value={aspiration.title}
                      >
                        {aspiration.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
              {isLoading ? "Saving..." : "Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
