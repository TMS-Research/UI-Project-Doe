import { Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ReactNode } from "react";

interface LoadingOverlayProps {
  message?: string;
  submessage?: string;
  icon?: ReactNode;
  progress?: number;
  isOpen?: boolean;
}

export function LoadingOverlay({
  message = "Loading...",
  submessage,
  icon,
  progress,
  isOpen = true,
}: LoadingOverlayProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-sm">
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          {icon ? (
            <div className="mb-2">{icon}</div>
          ) : (
            <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
          )}
          <p className="text-lg font-medium text-primary-foreground">{message}</p>
          {submessage && <p className="text-sm text-primary-foreground/80 text-center max-w-xs">{submessage}</p>}
          {progress !== undefined && (
            <div className="w-full max-w-xs mt-2">
              <Progress
                value={progress}
                className="h-2"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
