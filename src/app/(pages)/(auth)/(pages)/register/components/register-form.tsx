"use client";

import axiosInstance from "@/app/api/axios";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { RegisterFormData, RegisterReqBody, registerSchema } from "../lib/validation";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { LoginReqBody } from "../../login/lib/validation";
import { useAuthStore } from "@/stores/auth-store";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: mutateRegister } = useMutation({
    mutationFn: async (data: RegisterReqBody) => {
      setIsLoading(true);
      await axiosInstance.post("/auth/register", data);
      mutateLogin({ username: data.email, password: data.password });
    },
    mutationKey: ["register"],
    onError: () => {
      setIsLoading(false);
    },
  });

  const { mutate: mutateLogin } = useMutation({
    mutationFn: async (data: LoginReqBody) => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const response = await axiosInstance.postForm("/auth/login", formData);
      return response.data;
    },
    mutationKey: ["login"],
    onSuccess: async (data) => {
      const success = await login(data.access_token, data.rememberMe);

      if (success) {
        router.push("/register/academic-profile?from=basic-info");
      }
      form.reset();
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const reqBody: RegisterReqBody = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    mutateRegister(reqBody);
  };

  return (
    <div className="w-full max-w-md space-y-8 m-auto">
      <div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Create an Account 🚀</h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    placeholder="Create a password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full !mt-6"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
            {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account?</span>{" "}
            <Button
              variant="link"
              asChild
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
