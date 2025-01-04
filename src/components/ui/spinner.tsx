import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner = ({ size = "md", className }: SpinnerProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="absolute inset-0">
        <div className="w-full h-full rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>

      <div className="absolute inset-2">
        <div className="w-full h-full rounded-full border-4 border-primary/20 border-t-primary/80 animate-spin" 
             style={{ animationDuration: '0.6s' }} />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-primary/80 animate-pulse" />
      </div>
    </div>
  );
};
