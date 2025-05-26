import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  text?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function Loader({ text = "Loading...", className, size = "default" }: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-primary mr-2", sizeClasses[size])} />
      <span>{text}</span>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="bg-card border rounded-lg shadow-lg p-6 flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}

export function ContentLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <Loader size="lg" text="Loading content..." />
    </div>
  );
}
