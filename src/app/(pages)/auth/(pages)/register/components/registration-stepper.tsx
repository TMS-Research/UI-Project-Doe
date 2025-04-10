"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
  {
    title: "Basic Info",
    path: "/auth/register",
  },
  {
    title: "Academic Profile",
    path: "/auth/register/academic-profile",
  },
  {
    title: "Preferences",
    path: "/auth/register/preference-setup",
  },
];

export default function RegistrationStepper() {
  const pathname = usePathname();

  const currentStepIndex = steps.findIndex((step) => step.path === pathname);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isActive = index == currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <div
              key={step.path}
              className="flex flex-col items-center justify-center flex-1 relative"
            >
              <div className="flex items-center">
                <div className="relative flex items-center justify-center z-10">
                  <div
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center text-sm font-medium border-2",
                      isActive && "border-blue-600 bg-blue-50 text-blue-600",
                      isCompleted && "border-green-600 bg-green-600 text-white",
                      !isActive && !isCompleted && "border-gray-300 bg-white text-gray-500",
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4 text-white" /> : index + 1}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn("w-full left-[50%] absolute h-[2px] bg-gray-300", isCompleted && "bg-green-600")}
                  />
                )}
              </div>
              <p
                className={cn(
                  "mt-2 text-sm font-medium",
                  isActive && "text-blue-600",
                  isCompleted && "text-green-600",
                  !isActive && !isCompleted && "text-gray-500",
                )}
              >
                {step.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
