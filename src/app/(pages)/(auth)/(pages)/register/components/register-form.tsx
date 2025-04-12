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

export default function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: RegisterReqBody) => {
      const response = await axiosInstance.post("/auth/register", data);
      return response.data;
    },
    mutationKey: ["register"],
    onSuccess: (data) => {
      console.log(data);
      router.push("/register/academic-profile?from=basic-info");
    },
    onSettled: () => {
      form.reset();
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const reqBody: RegisterReqBody = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    mutate(reqBody);
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
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Create account"}
            {isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
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
