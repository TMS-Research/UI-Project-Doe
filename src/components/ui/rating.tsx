import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  className?: string;
  size?: number;
}

export function Rating({ value, max = 5, className, size = 20 }: RatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[...Array(max)].map((_, index) => (
        <Star
          key={index}
          size={size}
          className={cn(
            "fill-current",
            index < value
              ? "text-primary" // Filled star
              : "text-muted-foreground/20", // Empty star
          )}
        />
      ))}
    </div>
  );
}
