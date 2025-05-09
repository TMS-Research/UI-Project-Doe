"use client";

import axiosInstance from "@/app/api/axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "../lib/validation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (data: LoginFormData) => {
      setIsLoading(true);

      const response = await axiosInstance.post("/auth/login", data);
      return response.data;
    },
    mutationKey: ["login"],
    onSuccess: async (data) => {
      const success = await login(data.access_token, data.rememberMe);

      if (success) {
        router.push("/dashboard");
      }
      setIsLoading(false);
      form.reset();
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  return (
    <div className="w-full max-w-md space-y-8 m-auto">
      <div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">Welcome Back 👋</h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutate(data))}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Remember me</FormLabel>
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Button
                  variant="link"
                  asChild
                >
                  <Link href="/forgot-password">Forgot your password?</Link>
                </Button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full !mt-6"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
            {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don&apos;t have an account?</span>{" "}
            <Button
              variant="link"
              asChild
            >
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
