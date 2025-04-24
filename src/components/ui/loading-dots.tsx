import { cn } from "@/lib/utils";

export const LoadingDots = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="w-2 h-2 rounded-full bg-primary animate-[loading_0.8s_ease-in-out_infinite]" />
      <div className="w-2 h-2 rounded-full bg-primary animate-[loading_0.8s_ease-in-out_0.3s_infinite]" />
      <div className="w-2 h-2 rounded-full bg-primary animate-[loading_0.8s_ease-in-out_0.5s_infinite]" />
    </div>
  );
};
